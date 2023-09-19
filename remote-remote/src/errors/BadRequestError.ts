import { HTTPError } from './HTTPError';

export class BadRequestError extends HTTPError {
    constructor(message = 'Bad Request') {
        super(400, message);
    }
}
