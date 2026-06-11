import { NotFoundError } from '../../shared/errors';

export class VademecumEntryNotFoundError extends NotFoundError {
    constructor(id: number) {
        super(`errors.notFound.vademecumEntry: ${id}`);
    }
}
