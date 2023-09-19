import { Customers, ICustomers } from '../models/Customers';

const addCustomer = async (body: ICustomers) => {
  const customer = new Customers({
    id: body.id,
    apiKeyId: body.apiKeyId,
    createdAt: body.createdAt,
    apiKeyValue: body.apiKeyValue,
    email: body.email,
  });

  const savedCustomer = (await customer.save()) as ICustomers;

  console.info(`Successfully saved customer ${savedCustomer.id} with API key `);

  return savedCustomer;
};

const getCustomerById = async (id: string) => {
  const [item] = await Customers.query({
    id: { eq: id },
  })
    .limit(1)
    .exec();

  return item;
};

const getAllCustomers = async () => {
  return Customers.scan().exec();
};

export { addCustomer, getAllCustomers, getCustomerById };
