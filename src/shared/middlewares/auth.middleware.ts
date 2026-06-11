import { Request, Response, NextFunction } from 'express';

import { env } from '../../config/config';
import { ApiResponse } from '../api-response';

export const checkApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'] as string | undefined;

    if (!apiKey || apiKey !== env.VADEMECUM_API_KEY) {
        res.status(401).json(
            ApiResponse.error('UNAUTHORIZED', 'API Key inválida o no proporcionada')
        );
        return;
    }

    next();
};
