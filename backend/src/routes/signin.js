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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new client_1.PrismaClient();
const signinBody = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
const SignInRouter = express_1.default.Router();
SignInRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = signinBody.parse(req.body);
        const user = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}));
exports.default = SignInRouter;
