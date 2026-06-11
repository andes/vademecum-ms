import { Router } from 'express';

import vademecumRoutes from '../modules/vademecum/vademecum.routes';

const router = Router();

router.use('/', vademecumRoutes);

export default router;
