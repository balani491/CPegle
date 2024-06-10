"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paired = exports.userSockets = exports.wss = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const wss = new ws_1.WebSocketServer({ server });
exports.wss = wss;
const userSockets = new Map();
exports.userSockets = userSockets;
const paired = new Map();
exports.paired = paired;
// WebSocket logic can be added here
wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    ws.on('message', message => {
        const { event, data } = JSON.parse(message.toString());
        if (event === 'register') {
            userSockets.set(data.username, ws);
            console.log(`WebSocket registered for user ${data.username}`);
            ws.send(JSON.stringify({ event: 'registered', data: { message: 'WebSocket registered successfully' } }));
            // queue.push({ username: data.username, socket: ws });
        }
        if (event === 'messageSend') {
            const user1 = data.username;
            const user2 = paired.get(user1);
            const message = data.message;
            if (user2) {
                const user2Socket = userSockets.get(user2);
                console.log(`Message sent: ${message}`);
                if (user2Socket) {
                    user2Socket.send(JSON.stringify({ event: 'messageReceive', data: { username: user1, message } }));
                }
            }
            else {
                console.error(`User not paired: ${user1}`);
            }
        }
        if (event == 'messaageReceive') {
            console.log(`Message received: ${data.message}`);
        }
        if (event === 'competitionStart') {
            console.log(`Competition started with
             ${data.opponent}. Problem link: ${data.link}`);
        }
        if (event === 'winner') {
            console.log(`Winner is ${data.winner}`);
        }
        if (event === 'timeout') {
            console.log(`Timeout: ${data.message}`);
        }
    });
    ws.on('close', () => {
        console.log('WebSocket connection closed');
        userSockets.forEach((socket, username) => {
            if (socket === ws) {
                userSockets.delete(username);
            }
        });
    });
});
