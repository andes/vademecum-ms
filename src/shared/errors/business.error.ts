import { ApiError } from './base.error';

export class BusinessError extends ApiError {
    constructor(message = 'errors.business') {
        super(409, 'BUSINESS_ERROR', message);
    }
}
