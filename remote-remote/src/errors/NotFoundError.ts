import { HTTPError } from './HTTPError';

export class NotFoundError extends HTTPError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}
