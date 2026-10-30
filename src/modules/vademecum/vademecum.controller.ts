import { Request, Response, NextFunction } from 'express';

import { ApiResponse } from '../../shared/api-response';

import { VademecumService } from './vademecum.service';
import { searchMedicationsSchema } from './vademecum.dto';

export class VademecumController {
    constructor(private readonly vademecumService: VademecumService) {}

    searchMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = searchMedicationsSchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(422).json(ApiResponse.error('VALIDATION_ERROR', 'Parámetros inválidos', parsed.error.issues));
                return;
            }
            const results = await this.vademecumService.searchMedications(parsed.data);
            res.status(200).json(ApiResponse.success(results));
        } catch (error) {
            next(error);
        }
    };
}
