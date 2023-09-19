import { basicResponse } from '../common-repsonses';

export class HTTPError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }

  toResponse() {
    return basicResponse(this.statusCode, {
      message: this.message,
    });
  }
}
