import { Handler } from 'aws-lambda';
import { router } from './router';

const handler: Handler = async (event: any, _, callback) => {
  const method = event?.requestContext?.http
    ? event?.requestContext?.http.method
    : event?.requestContext?.httpMethod;

  const result = await router(method, event);

  callback(null, result);
};

export { handler };
