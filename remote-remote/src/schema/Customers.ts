import { Schema } from 'dynamoose';

export const Customers = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true
  },
  apiKeyId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: {
      value: Date,
      settings: {
        storage: 'iso', // Default: milliseconds
      },
    },
    default: () => new Date().toISOString(),
  },
  apiKeyValue: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});
