import express  from 'express';
import authRoutes  from './auth.routes';
import userRoutes  from './user.routes';
import uploadRoutes  from './upload.routes';

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/uploads", uploadRoutes);

export default router;
