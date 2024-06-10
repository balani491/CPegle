import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import jwt from "jsonwebtoken";
import zod from "zod";
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

const signupBody = zod.object({
    username: zod.string(),
    password: zod.string()
});

const signUpRouter = express.Router();

signUpRouter.post("/", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            username: req.body.username,
        },
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const exist = await axios.get(` https://codeforces.com/api/user.info?handles=${req.body.username}&checkHistoricHandles=false`)

    if (exist.data.status === "FAILED") {
        return res.status(411).json({
            message: "Codeforces handle doesn't exist"
        })
    }

    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        }
    });
    const userId = user.id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET!);

    res.json({
        message: "User created successfully",
        token: token
    })
});

export default signUpRouter;
