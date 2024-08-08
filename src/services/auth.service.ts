import { generateToken, verifyToken } from "../utils/jwt.utils";
import { User, PrismaClient } from "@prisma/client";
import {v4 as uuidv4} from 'uuid';
import bcryptjs from 'bcryptjs';
import sendMail from "../bg-services/mail.service";
import path from 'path';
import { uploadToCloudinary } from "../bg-services/cloudinary.service";

const prisma = new PrismaClient();

export class AuthService {
    async register(data: User) {
        const user = await prisma.user.create({
            data: {
                ...data,
                password: bcryptjs.hashSync(data.password, 10),
                id: uuidv4()
            }
        });
        const templatePath = path.join(__dirname, '../mails/welcome.mail.ejs');
        await sendMail({
            email: user.email,
            subject: 'Welcome to our platform',
            template: templatePath,
            body: {
               user,
            }
        });
        return user;
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (!bcryptjs.compareSync(password, user.password)) {
            throw new Error('Invalid credentials');
        }
        const token = generateToken({ id: user.id });
        return token;
    }

    async changePassword(email: string, oldPassword: string, newPassword: string) {
        const user  = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (!bcryptjs.compareSync(oldPassword, user.password)) {
            throw new Error('Wrong password');
        }
        const updatedUser = await prisma.user.update({
            where: {
                email
            },
            data: {
                password: bcryptjs.hashSync(newPassword, 10)
            }
        });
        return updatedUser;
    }

    async editProfile(email: string, data: Partial<User>) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const updatedUser = await prisma.user.update({
            where: {
                email
            },
            data
        });

        return updatedUser;
    }

    async editProfilePicture(email: string, picture: Express.Multer.File) {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const avatarUrl = await uploadToCloudinary(picture);
        const updatedUser= await prisma.user.update({
            where: {
                email
            },
            data: {
                avatarUrl
            }
        });

        return updatedUser;
    }
}