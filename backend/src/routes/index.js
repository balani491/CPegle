"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./signup"));
const signin_1 = __importDefault(require("./signin"));
const addqueue_1 = __importDefault(require("./addqueue"));
const router = express_1.default.Router();
router.use("/signup", signup_1.default);
router.use("/signin", signin_1.default);
router.use("/addqueue", addqueue_1.default);
exports.default = router;
