"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./socket"); // Import app, server, and wss from socket.ts
const index_1 = __importDefault(require("./routes/index"));
socket_1.app.use((0, cors_1.default)());
socket_1.app.use(express_1.default.json());
socket_1.app.use("/api/v1", index_1.default);
const PORT1 = process.env.PORT1 || 3001;
socket_1.server.listen(PORT1, () => {
    console.log(`Server is running on port ${PORT1}`);
});
