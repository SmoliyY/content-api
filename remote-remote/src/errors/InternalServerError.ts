import { HTTPError } from './HTTPError';

export class InternalServerError extends HTTPError {
  constructor(message = 'Internal Server Error') {
    super(500, message);
  }
}
