    import express from 'express';
    import { PrismaClient } from "@prisma/client";
    import jwt from "jsonwebtoken";
    import zod from 'zod';
    import dotenv from 'dotenv';

    dotenv.config();
    const JWT_SECRET = process.env.JWT_SECRET!; 

    const prisma = new PrismaClient();

    const signinBody = zod.object({
        username: zod.string(),
        password: zod.string(),
    });

    const SignInRouter = express.Router();

    SignInRouter.post("/", async (req, res) => {
        try {
            const { username, password } = signinBody.parse(req.body);

            
            const user = await prisma.user.findUnique({
                where: {
                    username: username,
                },
            });

            
            if (!user || user.password !== password) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            
            const token = jwt.sign({ userId: user.id }, JWT_SECRET);

            res.json({ token });
        } catch (error:any) {
            
            res.status(400).json({ message: error.message });
        }
    });

    export default SignInRouter;
