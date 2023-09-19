import { model, aws } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { Customers as CustomersSchema } from '../schema/Customers';

if (process.env.NODE_ENV === 'development') {
  aws.ddb.local('http://localhost:8001');
}

export interface ICustomers extends Item {
  id: string;
  apiKeyId: string;
  createdAt?: string;
  apiKeyValue: string;
  email: string,
}

export const Customers = model<ICustomers>('pulumiCustomers', CustomersSchema);
