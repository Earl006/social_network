import { AuthController } from "../controllers/auth.controller";
import { Router } from "express";
import { upload } from "../bg-services/cloudinary.service";

const router = Router();
const authController = new AuthController();

router.post('/create', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);
router.put('/edit-profile/:userId', authController.editProfile);
router.patch('/edit-profile-picture/:userId',upload.single('avatar'), authController.editProfilePicture);

export default router;