import { Router } from 'express';

import { checkApiKey } from '../../shared/middlewares/auth.middleware';

import { vademecumController } from './index';

const router = Router();

router.get('/medications', checkApiKey, vademecumController.searchMedications);

export default router;
