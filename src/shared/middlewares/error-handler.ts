import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors';
import { ApiResponse } from '../api-response';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json(
            ApiResponse.error(err.code, err.message)
        );
        return;
    }

    // eslint-disable-next-line no-console
    console.error('Unhandled error:', err);
    res.status(500).json(
        ApiResponse.error('INTERNAL_ERROR', 'Error interno del servidor')
    );
};
