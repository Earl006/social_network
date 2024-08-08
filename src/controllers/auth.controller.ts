import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
const authService = new AuthService();

// export const register = async (req: Request, res:Response) => {
//     try {
//         const user = await authService.register(req.body);
//         res.status(201).json(user);
//     } catch (error: any) {
//         res.status(400).json({ message: error.message || error });
//     }
// };

export class AuthController {
    async register(req: Request, res: Response) {
        try{
            const user = await authService.register(req.body);
            res.status(201).json(user);

        }
        catch (error: any) {
            res.status(400).json({ message: error.message || error });
        }
    }

    async login(req:Request, res: Response) {
        try {
            const token = await authService.login(req.body.email, req.body.password);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(400).json({ message: error.message || error });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const user = await authService.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message || error });
        }
    }

    async editProfile(req: Request, res: Response) {
        try{
            const user = await authService.editProfile(req.params.userId, req.body.data);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message || error });
        }
    }

    async editProfilePicture(req: Request, res: Response) {
        try{
            if (req.file) {
                const user = await authService.editProfilePicture(req.params.userId, req.file);
                res.status(200).json(user);
            } else {
                throw new Error('File is missing');
            }
        } catch (error: any) {
            res.status(400).json({ message: error.message || error });
        }
    
    }
    }
