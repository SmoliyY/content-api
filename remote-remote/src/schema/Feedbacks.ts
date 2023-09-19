import { Schema } from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const Feedbacks = new Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
    default: () => uuidv4(),
  },
  organizationId: {
    type: String,
    required: true,
    index: {
      name: 'organizationIdGlobalIndex',
      rangeKey: 'createdAt',
      type: 'global',
      project: true,
      throughput: {
        read: 1,
        write: 1,
      },
    },
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
  rating: {
    type: Number,
    validate: (value) => {
      const rating = Number(value);
      return !isNaN(rating) && rating >= 1 && rating <= 5;
    },
  },
  contentId: {
    type: String,
    required: true,
  },
  sentiment: {
    type: Boolean,
  },
  reason: {
    type: String,
  },
  userId: {
    type: String,
    default: () => uuidv4(),
  },
});
