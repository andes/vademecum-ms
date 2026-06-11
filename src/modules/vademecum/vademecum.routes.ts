import { Router } from 'express';

import { checkApiKey } from '../../shared/middlewares/auth.middleware';

import { vademecumController } from './index';

const router = Router();

router.get('/medications', checkApiKey, vademecumController.searchMedications);
router.get('/medications/:id', checkApiKey, vademecumController.showMedication);
router.get('/drugs', checkApiKey, vademecumController.searchDrugs);
router.get('/actions', checkApiKey, vademecumController.searchActions);
router.get('/stats', checkApiKey, vademecumController.stats);

export default router;
