import { HTTPError } from './HTTPError';

export class UnauthorizedError extends HTTPError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}
