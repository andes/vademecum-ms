import { ApiError } from './base.error';

export class ValidationError extends ApiError {
    constructor(message = 'errors.validation') {
        super(422, 'VALIDATION_ERROR', message);
    }
}
