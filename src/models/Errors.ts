import { HTTPError } from 'got';

export class ResponseError extends Error {
  code: string;

  constructor(error: HTTPError | ResponseError) {
    super();

    this.name = 'ResponseError';

    if ('response' in error) {
      this.code = error.response?.statusCode
        ? `HTTP_ERROR_${error.response.statusCode}`
        : error.code;

      if (error.response?.body) {
        if (error.response.body instanceof Buffer) {
          this.message = error.response.body.toString();
        } else if (typeof error.response.body === 'string') {
          this.message = error.response.body;
        } else {
          this.message = JSON.stringify(error.response.body);
        }
      }
    } else {
      this.message = error.message || 'response_error';
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
