import { Router } from 'express';
import * as profileController from '../controllers/profile.controller';

const router = Router();

router.get('/', profileController.getAllProfiles);
router.get('/search', profileController.searchProfiles);

export default router;
