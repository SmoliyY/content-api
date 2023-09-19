import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as apigateway from '@pulumi/aws-apigateway';
import * as dotenv from 'dotenv';

dotenv.config();

const config = new pulumi.Config();
const stageName = config.get('stageName') || 'stage';

const feedbackLambda = new aws.lambda.Function('PulumiFeedback', {
  code: new pulumi.asset.FileArchive('../.serverless/feedback.zip'),
  role: process.env.AWS_FEEDBACK_ARN!,
  handler: 'src/lambdas/feedback/index.handler',
  runtime: 'nodejs16.x',
});

const organizationLambda = new aws.lambda.Function('PulumiOrganization', {
  code: new pulumi.asset.FileArchive('../.serverless/organizations.zip'),
  role: process.env.AWS_FEEDBACK_ARN!,
  handler: 'src/lambdas/organization/index.handler',
  runtime: 'nodejs16.x',
});

const postConfirmLambda = new aws.lambda.Function('PostConfirm', {
  name: 'PostConfirm',
  code: new pulumi.asset.FileArchive('../.serverless/post-confirm.zip'),
  role: process.env.AWS_POST_CONFIRM_ARN!,
  handler: 'src/lambdas/post-confirm/index.handler',
  runtime: 'nodejs16.x',
});

const preAuthLambda = new aws.lambda.Function('PostAuth', {
  name: 'PreAuth',
  code: new pulumi.asset.FileArchive('../.serverless/pre-auth.zip'),
  role: process.env.AWS_POST_CONFIRM_ARN!,
  handler: 'src/lambdas/pre-auth/index.handler',
  runtime: 'nodejs16.x',
});

const pool = new aws.cognito.UserPool(
  'PulumiPool',
  {
    mfaConfiguration: 'OFF',
    passwordPolicy: {
      minimumLength: 12,
      temporaryPasswordValidityDays: 7,
      requireNumbers: true,
      requireLowercase: true,
    },
    emailConfiguration: {
      emailSendingAccount: 'COGNITO_DEFAULT',
    },
    usernameAttributes: ['email'],
    autoVerifiedAttributes: ['email'],
    lambdaConfig: {
      postConfirmation: postConfirmLambda.arn,
      preAuthentication: preAuthLambda.arn,
      // preSignUp:
      //   'arn:aws:lambda:us-east-1:188581793153:function:serverlessrepo-feedbacks-CognitoPreSignupTriggerFn', // TODO:
    },
  },
  {
    dependsOn: [postConfirmLambda, preAuthLambda],
  }
);

const cognitoDomain = new aws.cognito.UserPoolDomain('DarkSide', {
  userPoolId: pool.id,
  domain: 'darkside-feedbacks-1',
});

const resourceServer = new aws.cognito.ResourceServer('Redocly', {
  identifier: 'https://dark-side-portal.redoc.ly',
  userPoolId: pool.id,
  scopes: [
    {
      scopeName: 'api-key:read',
      scopeDescription: 'API Key',
    },
  ],
});

const customScope = 'https://dark-side-portal.redoc.ly/api-key:read';

const clientAppIntegration = new aws.cognito.UserPoolClient(
  'Redocly',
  {
    userPoolId: pool.id,
    supportedIdentityProviders: ['COGNITO'],
    allowedOauthFlows: ['code'],
    explicitAuthFlows: ['ALLOW_CUSTOM_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH', 'ALLOW_USER_SRP_AUTH'],
    generateSecret: true,
    callbackUrls: ['https://dark-side-portal.redoc.ly/_auth/oidc'],
    allowedOauthScopes: resourceServer.scopeIdentifiers.apply((scopes) => ['phone', 'email', 'openid', ...scopes]),
  },
  {
    dependsOn: [resourceServer],
  }
);


const FEEDBACK_PATH = '/feedback';
const FEEDBACK_BY_ID_PATH = `${FEEDBACK_PATH}/{feedbackId}`;
const FEEDBACK_BY_CONTENT_ID = '/content/{contentId}/feedback';

const corsHandler = ({ methods, headers } = { methods: '*', headers: '*' }) => {
  return {
    headers: {
      'Access-Control-Allow-Headers': headers || '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': methods || '*',
    },
  };
};
const allowedHeaders = ['Authorization','Content-Type','x-api-key']
const api = new apigateway.RestAPI(
  'PulumiFeedback',
  {
    apiKeySource: 'HEADER',
    stageName,
    routes: [
      {
        path: '/{proxy+}',
        method: 'OPTIONS',
        eventHandler: new aws.lambda.CallbackFunction('cors-handler', {
          callback: async () =>
            corsHandler({ headers: allowedHeaders.join(','), methods: '*' }),
        }),
      },
      {
        path: FEEDBACK_PATH,
        method: 'GET',
        eventHandler: feedbackLambda,
        apiKeyRequired: true,
      },
      {
        path: FEEDBACK_PATH,
        method: 'POST',
        eventHandler: feedbackLambda,
        apiKeyRequired: true,
      },
      {
        path: FEEDBACK_BY_ID_PATH,
        method: 'GET',
        eventHandler: feedbackLambda,
        apiKeyRequired: true,
      },
      {
        path: FEEDBACK_BY_ID_PATH,
        method: 'PATCH',
        eventHandler: feedbackLambda,
        apiKeyRequired: true,
      },
      {
        path: FEEDBACK_BY_ID_PATH,
        method: 'DELETE',
        eventHandler: feedbackLambda,
        apiKeyRequired: true,
      },
      {
        path: FEEDBACK_BY_CONTENT_ID,
        method: 'GET',
        eventHandler: feedbackLambda,
        apiKeyRequired: true,
      },
      {
        path: '/organization/api-key',
        method: 'GET',
        eventHandler: organizationLambda,
        authorizers: [
          {
            parameterName: 'Authorization',
            identitySource: ['method.request.header.Authorization'],
            providerARNs: [pool.arn],
            methodsToAuthorize: [customScope],
          },
        ],
      },
    ],
  },
  {
    dependsOn: [pool, resourceServer],
  }
);

const feedbackUsagePlan = new aws.apigateway.UsagePlan('feedbackUsagePlan', {
  name: 'feedbackUsagePlan',
  description: 'Feedback Usage Plan',
  productCode: 'SOMECODE',
  apiStages: [
    {
      apiId: api.api.id,
      stage: api.stage.stageName,
    },
  ],
  quotaSettings: {
    limit: 200,
    offset: 5,
    period: 'WEEK',
  },
  throttleSettings: {
    burstLimit: 50,
    rateLimit: 100,
  },
});

const pulumiApiKey = new aws.apigateway.ApiKey('pulumiApiKey', {});

const planKey = new aws.apigateway.UsagePlanKey('main', {
  keyId: pulumiApiKey.id,
  keyType: 'API_KEY',
  usagePlanId: feedbackUsagePlan.id,
});

const settings = new aws.apigateway.MethodSettings('pulumiSettings', {
  restApi: api.api.id,
  stageName: api.stage.stageName,
  methodPath: '*/*',
  settings: {
    metricsEnabled: true,
    loggingLevel: 'INFO',
  },
});

const wafAcl = new aws.wafv2.WebAcl('pulumiAcl', {
  name: 'pulumiAcl',
  defaultAction: {
    allow: {},
  },
  rules: [
    {
      name: 'MaxRequests',
      priority: 0,
      statement: {
        rateBasedStatement: {
          limit: 1000,
          aggregateKeyType: 'IP',
        },
      },
      action: {
        block: {},
      },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudwatchMetricsEnabled: true,
        metricName: 'MaxRequests',
      },
    },
  ],
  visibilityConfig: {
    sampledRequestsEnabled: true,
    cloudwatchMetricsEnabled: true,
    metricName: 'pulumiAcl',
  },
  scope: 'REGIONAL',
});

const webAclAssociation = new aws.wafv2.WebAclAssociation('pulumiWebAclAssociation', {
  resourceArn: api.stage.arn,
  webAclArn: wafAcl.arn,
});

const feedbackDB = new aws.dynamodb.Table('Feedbacks', {
  // name: ''
  attributes: [
    {
      name: 'Id',
      type: 'S',
    },
    {
      name: 'organizationId',
      type: 'S',
    },
    {
      name: 'createdAt',
      type: 'S',
    },
    // {
    //   name: "rating",
    //   type: "N",
    // },
    // {
    //   name: "contentId",
    //   type: "S",
    // },
    // {
    //   name: "userId",
    //   type: "S",
    // },
    // {
    //   name: "sentiment",
    //   type: "B",
    // },
    // {
    //   name: "reason",
    //   type: "S",
    // },
  ],
  globalSecondaryIndexes: [
    {
      name: 'organizationIdGlobalIndex',
      rangeKey: 'createdAt',
      hashKey: 'organizationId',
      projectionType: 'INCLUDE',
      writeCapacity: 1,
      readCapacity: 1,
      nonKeyAttributes: ['rating', 'reason', 'contentId', 'userId', 'sentiment'],
    },
  ],
  hashKey: 'Id',
  readCapacity: 1,
  writeCapacity: 1,
});

const customersDB = new aws.dynamodb.Table('Customers', {
  name: 'pulumiCustomers',
  attributes: [
    {
      name: 'id',
      type: 'S',
    },
    // {
    //   name: 'apiKeyId',
    //   type: 'S',
    // },
    // {
    //   name: 'createdAt',
    //   type: 'S',
    // },
    // {
    //   name: "apiKeyValue",
    //   type: "S",
    // },
    // {
    //   name: "email",
    //   type: "S",
    // }
  ],
  hashKey: 'id',
  readCapacity: 1,
  writeCapacity: 1,
});


const feedbacksOrigin = 'feedbacks-api';
const cloudfront = new aws.cloudfront.Distribution(
  'feedbacks',
  {
    origins: [
      {
        domainName: api.url.apply(url => new URL(url).host),
        originId: feedbacksOrigin,
        originPath: api.url.apply(url => new URL(url).pathname.replace(/\/$/, '')),
        customOriginConfig: {
          originProtocolPolicy: 'https-only',
          httpPort: 80,
          httpsPort: 443,
          originSslProtocols: ['TLSv1.2'],
        }
      },
    ],
    enabled: true,
    defaultCacheBehavior: {
      compress: false,
      allowedMethods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
      cachedMethods: ['GET', 'HEAD'],
      targetOriginId: feedbacksOrigin,
      forwardedValues: {
        queryString: false,
        cookies: {
          forward: 'none',
        },
        headers: allowedHeaders,
      },
      responseHeadersPolicyId: '5cc3b908-e619-4b99-88e5-2cf7f45965bd',
      viewerProtocolPolicy: 'https-only',
      minTtl: 0,
      defaultTtl: 0,
      maxTtl: 0,
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
    priceClass: 'PriceClass_All',
    restrictions: {
      geoRestriction: {
        restrictionType: 'none',
      },
    },
  },
  {
    dependsOn: [api],
  }
);

export const url = cloudfront.domainName;
