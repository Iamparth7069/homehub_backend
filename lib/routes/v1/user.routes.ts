import express  from 'express';
import userController  from '../../controllers/user.controller';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.get("/", authenticate, userController.getUser);

export default router;
