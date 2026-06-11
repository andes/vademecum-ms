import { ApiError } from './base.error';

export class NotFoundError extends ApiError {
    constructor(message = 'errors.notFound') {
        super(404, 'NOT_FOUND', message);
    }
}
