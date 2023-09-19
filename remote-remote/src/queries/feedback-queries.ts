import { NotFoundError } from './../errors/NotFoundError';
import { Feedback, IFeedback } from '../models/Feedback';
import { Condition } from 'dynamoose';
import { FeedbackParameters } from '../utils';
import { SortOrder } from 'dynamoose/dist/General';

type EditedFeedback = Pick<
  IFeedback,
  'rating' | 'reason' | 'sentiment' | 'suggestion' | 'contentId'
>;

const addFeedback = async (body: IFeedback) => {
  // TODO: verify user has WRITE permissions
  // TODO: verify user belongs to this organization
  const feedbackToSave = new Feedback({
    organizationId: body.organizationId,
    userId: body.userId,
    contentId: body.contentId,
    rating: body.rating,
    sentiment: body.sentiment,
    suggestion: body.suggestion,
    reason: body.reason,
  });

  const savedFeedback = (await feedbackToSave.save()) as IFeedback;

  console.info(
    `Successfully added feedback ${savedFeedback.id}, orgId: ${savedFeedback.organizationId}`
  );

  const { id, ...feedback } = savedFeedback;

  return { id, feedback };
};

const getFeedbacksByOrganizationIdWithFilter = async (
  organizationId: string,
  queryParams: FeedbackParameters
) => {
  let query = Feedback.query({ organizationId: { eq: organizationId } }).using(
    'organizationIdGlobalIndex'
  );
  let countQuery = Feedback.query({ organizationId: { eq: organizationId } }).using(
    'organizationIdGlobalIndex'
  );

  const startFrom = queryParams.offset ? queryParams.offset : 0;

  if (queryParams.contentId) {
    query.and().attribute('contentId').eq(queryParams.contentId);
    countQuery.and().attribute('contentId').eq(queryParams.contentId);
  }

  const { count } = await countQuery.count().exec();
  if (queryParams.limit && count > 1) {
    query.and().limit(Number(startFrom) + Number(queryParams.limit));
  }

  if (queryParams.order === 'oldest') {
    query.and().sort(SortOrder.ascending);
  } else {
    query.and().sort(SortOrder.descending);
  }

  const feedbacks = await query.exec();
  return {
    items: feedbacks.slice(startFrom).map((item) => {
      const { id, ...feedback } = item;
      return { id, feedback };
    }),
    limit: count,
  };
};

const getFeedbackById = async (id: string, organizationId: string) => {
  const [item] = await Feedback.query({
    id: { eq: id },
  })
    .and()
    .attribute('organizationId')
    .eq(organizationId)
    .limit(1)
    .exec();

  if (item) {
    return item;
  }
  throw new NotFoundError();
};

const getFeedbackByContentIdAndUserId = async (
  organizationId: string,
  contentId: string,
  userId: string
) => {
  if (!userId || !contentId) {
    return undefined;
  }
  const items = await Feedback.query({
    organizationId: { eq: organizationId },
  })
    .attribute('contentId')
    .eq(contentId)
    .attribute('userId')
    .eq(userId)
    .exec();

  return items[0];
};

const getAllFeedbacks = async () => {
  return Feedback.scan().exec();
};

const deleteFeedbackById = async (id: string, organizationId: string) => {
  // TODO: verify user has WRITE permissions
  // TODO: verify user belongs to this organization

  const item = await getFeedbackById(id, organizationId);

  if (item) {
    await item.delete();
    const { id, ...feedback } = item;
    return { id, feedback };
  }

  throw new NotFoundError();
};

const editFeedbackById = async (
  feedbackId: string,
  organizationId: string,
  editedFeedback: EditedFeedback
) => {
  // TODO: verify user has WRITE permissions
  // TODO: verify user belongs to this organization

  try {
    const edited = await Feedback.update(
      feedbackId,
      {
        rating: editedFeedback.rating,
        sentiment: editedFeedback.sentiment,
        reason: editedFeedback.reason,
        suggestion: editedFeedback.suggestion,
        contentId: editedFeedback.contentId,
      },
      {
        condition: new Condition().where('organizationId').eq(organizationId),
      }
    );

    const { id, ...feedback } = edited;

    return { id, feedback };
  } catch (e) {
    if (e.message?.includes('The conditional request failed')) {
      throw new NotFoundError();
    } else {
      throw e;
    }
  }
};

export {
  addFeedback,
  getFeedbackById,
  deleteFeedbackById,
  getAllFeedbacks,
  editFeedbackById,
  getFeedbacksByOrganizationIdWithFilter,
  getFeedbackByContentIdAndUserId,
};
