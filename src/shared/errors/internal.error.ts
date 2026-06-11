import { ApiError } from './base.error';

export class InternalError extends ApiError {
    constructor(message = 'errors.internal') {
        super(500, 'INTERNAL_ERROR', message);
    }
}
