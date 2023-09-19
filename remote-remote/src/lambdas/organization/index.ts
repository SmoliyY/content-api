import { Handler } from 'aws-lambda';
import { getCustomerById } from '../../queries/customers-queries';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import { successfullResponse } from '../../common-repsonses';

const handler: Handler = async (event: any, context) => {
  console.log('event', JSON.stringify(event, null, '\t'));
  console.log('context', JSON.stringify(context, null, '\t'));

  // TODO THIS should trigger only one get

  const userId = event.requestContext?.authorizer?.claims?.sub;
  console.log('Get "sub" claims', userId);

  if (!userId) throw new UnauthorizedError();

  const customer = await getCustomerById(userId);

  if (!customer) {
    console.error(`Customer with id: ${userId} not found`);
    throw new UnauthorizedError();
  }

  return successfullResponse({ data: customer.apiKeyValue });
};

export { handler };
