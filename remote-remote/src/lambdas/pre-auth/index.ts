import { Handler } from 'aws-lambda';
import { getCustomerById } from '../../queries/customers-queries';

const handler: Handler = async (event) => {
  const {
    request: {
      userAttributes: { sub },
    },
  } = event;

  try {
    const item = await getCustomerById(sub);

    if (!item) {
      console.info(`User ${sub} does not exist`);
      throw new Error('Wrong credentials');
    }
  } catch (e) {
    console.info(e);
    throw new Error('Something went wrong');
  }

  return event;
};

export { handler };
