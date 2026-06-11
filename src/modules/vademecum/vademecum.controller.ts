import { Request, Response, NextFunction } from 'express';

import { ApiResponse } from '../../shared/api-response';

import { VademecumService } from './vademecum.service';
import { searchMedicationsSchema, searchDrugsSchema, searchActionsSchema, medicationParamsSchema } from './vademecum.dto';

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

    showMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = medicationParamsSchema.safeParse(req.params);
            if (!parsed.success) {
                res.status(422).json(ApiResponse.error('VALIDATION_ERROR', 'ID inválido'));
                return;
            }
            const entry = await this.vademecumService.getMedicationById(parsed.data.id);
            res.status(200).json(ApiResponse.success(entry));
        } catch (error) {
            next(error);
        }
    };

    searchDrugs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = searchDrugsSchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(422).json(ApiResponse.error('VALIDATION_ERROR', 'Parámetros inválidos'));
                return;
            }
            const results = await this.vademecumService.searchDrugs(parsed.data);
            res.status(200).json(ApiResponse.success(results));
        } catch (error) {
            next(error);
        }
    };

    searchActions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = searchActionsSchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(422).json(ApiResponse.error('VALIDATION_ERROR', 'Parámetros inválidos'));
                return;
            }
            const results = await this.vademecumService.searchActions(parsed.data);
            res.status(200).json(ApiResponse.success(results));
        } catch (error) {
            next(error);
        }
    };

    stats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await this.vademecumService.getStats();
            res.status(200).json(ApiResponse.success(stats));
        } catch (error) {
            next(error);
        }
    };
}
