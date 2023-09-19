import { validate } from 'uuid';

export function noLeadingSlash(path: string): string {
  return path.replace(/^\//, '');
}

export function getFeedbackIdFromPath(path: string): string | undefined {
  const [_, feedbackId] = noLeadingSlash(path).split('/');

  return validate(feedbackId) ? feedbackId : undefined;
}

export function isByIdPath(path: string): boolean {
  // Verify requests is not coming to '/feedbacks/{feedbackId}/subpath'
  const [, , subpath] = noLeadingSlash(path).split('/');

  return getFeedbackIdFromPath(path) && subpath === undefined;
}

export function getLowercasedHeaders (event: any): any {
  return Object.keys(event?.headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = event?.headers[key];
    
    return acc;
  }, {});
}

export function getApiKey(event: any): string | undefined {
  const lowercased = getLowercasedHeaders(event);

  return lowercased['x-api-key'];
}

export function decodeFromBase64(base64: string): any {
  const decodedString = new Buffer(base64, 'base64').toString('utf8');
  try {
    return JSON.parse(decodedString);
  } catch (e) {
    console.info(e);
    return null;
  }
}

export function queryStringToObject(queryString: string): any {
  const entries = new URLSearchParams(queryString).entries();
  let result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export interface FeedbackParameters {
  offset?: number;
  limit?: number;
  order?: string;
  contentId?: string;
}
