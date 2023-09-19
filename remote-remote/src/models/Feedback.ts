import { model, aws } from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { Feedbacks as FeedbacksSchema } from '../schema/Feedbacks';

if (process.env.NODE_ENV === 'development') {
  aws.ddb.local('http://localhost:8001');
}

export interface IFeedback extends Item {
  id: string;
  organizationId: string;
  userId: string;
  contentId: string;
  rating: number;
  createdAt: Date;
  sentiment?: boolean;
  suggestion?: string;
  reason?: string;
}

export const Feedback = model<IFeedback>('Feedback', FeedbacksSchema);
