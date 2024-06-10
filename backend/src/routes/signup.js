"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const signupBody = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string()
});
const signUpRouter = express_1.default.Router();
signUpRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }
    const existingUser = yield prisma.user.findFirst({
        where: {
            username: req.body.username,
        },
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        });
    }
    const exist = yield axios_1.default.get(` https://codeforces.com/api/user.info?handles=${req.body.username}&checkHistoricHandles=false`);
    if (exist.data.status === "FAILED") {
        return res.status(411).json({
            message: "Codeforces handle doesn't exist"
        });
    }
    const user = yield prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        }
    });
    const userId = user.id;
    const token = jsonwebtoken_1.default.sign({
        userId
    }, JWT_SECRET);
    res.json({
        message: "User created successfully",
        token: token
    });
}));
exports.default = signUpRouter;
