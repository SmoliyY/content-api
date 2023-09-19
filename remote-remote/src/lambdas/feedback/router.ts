import { successfullResponse } from '../../common-repsonses';
import { HTTPError } from '../../errors/HTTPError';
import { InternalServerError } from '../../errors/InternalServerError';
import { NotFoundError } from '../../errors/NotFoundError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';
import {
  addFeedback,
  deleteFeedbackById,
  editFeedbackById,
  getAllFeedbacks,
  getFeedbackByContentIdAndUserId,
  getFeedbackById,
  getFeedbacksByOrganizationIdWithFilter,
} from '../../queries/feedback-queries';
import {
  getFeedbackIdFromPath,
  isByIdPath,
  getApiKey,
  decodeFromBase64,
  queryStringToObject,
  getLowercasedHeaders,
} from '../../utils';
import { BadRequestError } from '../../errors/BadRequestError';

enum HTTP_METHODS {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

const FEEDBACK_ENDPOINT = '/feedback';
const FEEDBACK_CONTENT_ENDPOINT = '/content';

const router = async (method: HTTP_METHODS, event: any) => {
  const { path, rawPath } = event;
  const headers = getLowercasedHeaders(event);

  console.log('Headers', headers);
  console.log('event', JSON.stringify(event, null, '\t'));

  const apiPath = path ? path : rawPath;
  const contentType = headers['content-type'];

  if (contentType !== 'application/json') {
    return new NotFoundError('Such path does not exist').toResponse();
  }

  const apiKey = getApiKey(event);

  // TODO: verifiy apiKey is decrypted to valid exisiting orgID
  if (!apiKey) {
    return new UnauthorizedError().toResponse();
  }

  const data = decodeFromBase64(apiKey);

  if (!data?.orgId) {
    return new UnauthorizedError().toResponse();
  }

  if (apiPath.startsWith(FEEDBACK_CONTENT_ENDPOINT) && method === HTTP_METHODS.GET) {
    return handleGETFeedbacksByContentAndId(event, data.orgId);
  }

  if (apiPath.startsWith(FEEDBACK_ENDPOINT)) {
    switch (method) {
      case HTTP_METHODS.GET:
        return handleGETFeedbacks(event, data.orgId, apiPath);
      case HTTP_METHODS.POST:
        return handlePOSTFeedbacks(event, data.orgId, apiPath);
      case HTTP_METHODS.PATCH:
        return handlePATCHFeedbacks(event, data.orgId, apiPath);
      case HTTP_METHODS.DELETE:
        return handleDELETEFeedbacks(event, data.orgId, apiPath);
      default:
        return new NotFoundError('Such resources does not exist').toResponse();
    }
  }

  return new NotFoundError('Such resources does not exist').toResponse();
};

async function handleGETFeedbacks(event: any, organizationId: string, path: string) {
  const parameters = event.queryStringParameters
    ? event.queryStringParameters
    : queryStringToObject(event.rawQueryString);

  try {
    if (path === FEEDBACK_ENDPOINT) {
      return successfullResponse(
        await getFeedbacksByOrganizationIdWithFilter(organizationId, parameters)
      );
    }

    if (path === `${FEEDBACK_ENDPOINT}/all`) {
      return successfullResponse(await getAllFeedbacks());
    }

    if (isByIdPath(path)) {
      const feedbackId = getFeedbackIdFromPath(path);
      const { id, ...feedback } = await getFeedbackById(feedbackId, organizationId);
      return successfullResponse({ id, feedback });
    }

    console.error('Not found', event);
    return new NotFoundError().toResponse();
  } catch (e) {
    if (e instanceof HTTPError) {
      return e.toResponse();
    }
    return new InternalServerError().toResponse();
  }
}

async function handleGETFeedbacksByContentAndId(event: any, orgId: string) {
  const { user } = event.queryStringParameters
    ? event.queryStringParameters
    : queryStringToObject(event.rawQueryString);
  const contentId = event.pathParameters?.contentId
    ? decodeURIComponent(event.pathParameters.contentId)
    : null;

  if (!user || !contentId) {
    return new BadRequestError().toResponse();
  }

  try {
    const item = await getFeedbackByContentIdAndUserId(orgId, contentId, user);
    if (!item) {
      return new NotFoundError().toResponse();
    }

    const { id, ...feedback } = item;
    return successfullResponse({ id, feedback });
  } catch (e) {
    return new InternalServerError().toResponse();
  }
}

async function handlePOSTFeedbacks(event: any, organizationId: string, path: string) {
  const { body, isBase64Encoded } = event;
  const normalizedBody = isBase64Encoded ? decodeFromBase64(body) : JSON.parse(body);

  try {
    if (path === FEEDBACK_ENDPOINT) {
      const feedBackToUpdate = await getFeedbackByContentIdAndUserId(
        organizationId,
        normalizedBody.contentId,
        normalizedBody.userId
      );

      const feedback = feedBackToUpdate
        ? await editFeedbackById(feedBackToUpdate.id, organizationId, normalizedBody)
        : await addFeedback({ ...normalizedBody, organizationId });

      return successfullResponse(feedback);
    }

    console.error('Not found', event);

    return new NotFoundError().toResponse();
  } catch (e) {
    console.error(e, { ...normalizedBody });

    return new InternalServerError().toResponse();
  }
}

async function handlePATCHFeedbacks(event: any, organizationId: string, path: string) {
  const { body, isBase64Encoded } = event;
  const normalizedBody = isBase64Encoded ? decodeFromBase64(body) : JSON.parse(body);

  try {
    if (isByIdPath(path)) {
      const feedbackId = getFeedbackIdFromPath(path);

      return successfullResponse(
        await editFeedbackById(feedbackId, organizationId, normalizedBody)
      );
    }

    console.error('Not found', event);

    return new NotFoundError().toResponse();
  } catch (e) {
    console.error(e);

    return new HTTPError(e.statusCode || 500, e.message).toResponse();
  }
}

async function handleDELETEFeedbacks(event: any, organizationId: string, path: string) {
  try {
    if (isByIdPath(path)) {
      const feedbackId = getFeedbackIdFromPath(path);

      return successfullResponse((await deleteFeedbackById(feedbackId, organizationId)) || null);
    }

    console.error('Not found', event);

    return new NotFoundError().toResponse();
  } catch (e) {
    console.error(e, event);

    return new HTTPError(e.statusCode || 500, e.message).toResponse();
  }
}

export { router };
