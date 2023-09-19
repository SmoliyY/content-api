import { Handler } from 'aws-lambda';
import { APIGateway } from 'aws-sdk';
import { ICustomers } from '../../models/Customers';
import { addCustomer } from '../../queries/customers-queries';

const gatewayClient = new APIGateway();

const getApiKeyForCustomer = async (id) => {
  console.log(`Getting API Key for customer  ${id}`);

  const params = {
    limit: 1,
    includeValues: true,
    nameQuery: id,
  };

  try {
    const { items } = await gatewayClient.getApiKeys(params).promise();
    return items?.length ? items[0] : null;
  } catch (e) {
    return e;
  }
};

const encodeKey = (id) => new Buffer(JSON.stringify({orgId:id}), 'utf-8').toString('base64');

const createApiKey = async (sub) => {
  try {
    const data = await gatewayClient
      .createApiKey({
        customerId: sub,
        enabled: true,
        name: sub,
        value: encodeKey(sub)
      })
      .promise();
    return data;
  } catch (e) {
    console.info(e, 'can not create api key');
  }
};

const getUsagePlanIdByName = async () => {
  const { items } = await gatewayClient.getUsagePlans().promise();
  const filteredPlans = items.find(({ name }) => 'feedbackUsagePlan' === name);
  const { id } = filteredPlans;
  return id;
};

const attachUsagePlan = async (usagePlanId, apiKeyId) => {
  await gatewayClient
    .createUsagePlanKey({
      usagePlanId,
      keyId: apiKeyId,
      keyType: 'API_KEY',
    })
    .promise();
};

const handler: Handler = async (event: any, _) => {
  // console.log(event);

  const {
    request: {
      userAttributes: { sub, email },
    },
    triggerSource,
  } = event;

  if (triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    console.info(
      'Exiting Post Confirmation trigger early because' +
        ` triggerSource=[${event.triggerSource}]` +
        ' != "PostConfirmation_ConfirmSignUp"'
    );
    return event;
  }

  const apiKey = await getApiKeyForCustomer(sub);

  if (apiKey) {
    console.info('User already have a key');
    return event;
  } else {
    const { id: apiKeyId, value: apiKeyValue } = await createApiKey(sub);
    const usagePlanId = await getUsagePlanIdByName();

    try {
      await attachUsagePlan(usagePlanId, apiKeyId);

      await addCustomer({
        id: sub,
        email,
        apiKeyId,
        apiKeyValue,
      } as ICustomers);

      console.info(`Succesfully created key for ${sub}`);
    } catch (e) {
      console.info('Cannot assotiate key');
      return e;
    }
  }

  return event;
};

export { handler };
