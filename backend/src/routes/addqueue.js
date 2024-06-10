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
exports.paired = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const verify_1 = __importDefault(require("../middleware/verify"));
const socket_1 = require("../socket");
Object.defineProperty(exports, "paired", { enumerable: true, get: function () { return socket_1.paired; } });
const socket_2 = require("../socket");
const prisma = new client_1.PrismaClient();
const addQueueRouter = express_1.default.Router();
// const paired= new Map<string,string>();
const queue = [];
// const userSockets: Map<string, WebSocket> = new Map();
function pollSubmissions(user1, user2, competitionLink) {
    return __awaiter(this, void 0, void 0, function* () {
        const pollInterval = 5000; // Poll every 5 seconds
        const startTime = Date.now();
        const maxDuration = 600000; // Poll for a maximum of 10 minutes
        const checkSubmissions = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const user1Submissions = yield axios_1.default.get(`https://codeforces.com/api/user.status?handle=${user1}&from=1&count=1`);
                const user2Submissions = yield axios_1.default.get(`https://codeforces.com/api/user.status?handle=${user2}&from=1&count=1`);
                const linkMatch = competitionLink.match(/\/problem\/(\d+)\/(\w+)/);
                var contestId, problemIndex;
                if (!linkMatch) {
                    console.error('Invalid competition link format');
                    // Handle the error appropriately
                }
                else {
                    contestId = linkMatch[1];
                    problemIndex = linkMatch[2];
                    // Find matching submissions
                }
                const user1Solved = user1Submissions.data.result.find((submission) => submission.problem.contestId == contestId &&
                    submission.problem.index == problemIndex &&
                    submission.verdict === 'OK');
                const user2Solved = user2Submissions.data.result.find((submission) => submission.problem.contestId == contestId &&
                    submission.problem.index == problemIndex &&
                    submission.verdict === 'OK');
                // const user1Solved = user1Submissions.data.result.find((submission: any) => submission.problem.url === competitionLink && submission.verdict === 'OK');
                // const user2Solved = user2Submissions.data.result.find((submission: any) => submission.problem.url === competitionLink && submission.verdict === 'OK');
                if (user1Solved || user2Solved) {
                    let winner;
                    if (user1Solved && user2Solved) {
                        // Both solved; determine who solved first
                        winner = user1Solved.creationTimeSeconds < user2Solved.creationTimeSeconds ? user1 : user2;
                    }
                    else if (user1Solved) {
                        winner = user1;
                    }
                    else {
                        winner = user2;
                    }
                    const user1Socket = socket_2.userSockets.get(user1);
                    const user2Socket = socket_2.userSockets.get(user2);
                    if (user1Socket) {
                        user1Socket.send(JSON.stringify({ event: 'winner', data: { winner } }));
                    }
                    if (user2Socket) {
                        user2Socket.send(JSON.stringify({ event: 'winner', data: { winner } }));
                    }
                    return; // Stop polling
                }
                if (Date.now() - startTime < maxDuration) {
                    setTimeout(checkSubmissions, pollInterval);
                }
                else {
                    // No submissions within maxDuration
                    const user1Socket = socket_2.userSockets.get(user1);
                    const user2Socket = socket_2.userSockets.get(user2);
                    if (user1Socket) {
                        user1Socket.send(JSON.stringify({ event: 'timeout', data: { message: 'No submissions detected within the time limit' } }));
                    }
                    if (user2Socket) {
                        user2Socket.send(JSON.stringify({ event: 'timeout', data: { message: 'No submissions detected within the time limit' } }));
                    }
                }
            }
            catch (error) {
                console.error('Error polling submissions:', error.message);
            }
        });
        checkSubmissions();
    });
}
function giveCompetition(user1, user2) {
    return __awaiter(this, void 0, void 0, function* () {
        const data1 = yield axios_1.default.get(`https://codeforces.com/api/user.info?handles=${user1}&checkHistoricHandles=false`);
        const rating1 = data1.data.result[0].rating;
        const data2 = yield axios_1.default.get(`https://codeforces.com/api/user.info?handles=${user2}&checkHistoricHandles=false`);
        const rating2 = data2.data.result[0].rating;
        let mid = (rating1 + rating2) / 2;
        mid = Math.floor(mid / 100) * 100;
        const question = yield axios_1.default.get(`https://codeforces.com/api/problemset.problems?rating=${mid}`);
        const problems = question.data.result.problems;
        const randomIndex = Math.floor(Math.random() * problems.length);
        const randomProblem = problems[randomIndex];
        const link = `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`;
        return link;
    });
}
addQueueRouter.post("/", verify_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.username;
    // const userInQueue = queue.find(q => q.username === user);
    // if (userInQueue) {
    //   return res.json({ message: "User already in queue" });
    // }
    try {
        const d = yield axios_1.default.get(`https://codeforces.com/api/user.info?handles=${user}&checkHistoricHandles=false`);
        const rating = d.data.result[0].rating;
        // console.log(`User ${user} has rating ${rating}`);
        const userSocket = socket_2.userSockets.get(user);
        if (!userSocket) {
            return res.status(400).json({ message: "WebSocket connection not established" });
        }
        yield prisma.queue.create({
            data: {
                username: user,
                done: false,
                rating: 1200
            }
        });
        queue.push({ username: user, socket: userSocket });
        if (queue.length < 2) {
            return res.json({ message: "No one in queue. Please try later" });
        }
        else {
            const user1 = queue.shift();
            const user2 = queue.shift();
            if (user1 && user2) {
                socket_1.paired.set(user1.username, user2.username);
                socket_1.paired.set(user2.username, user1.username);
            }
            if (!user1 || !user2) {
                return res.status(500).json({ message: "Queue processing error" });
            }
            yield prisma.queue.deleteMany({
                where: {
                    username: { in: [user1.username, user2.username] }
                }
            });
            const competition = yield giveCompetition(user1.username, user2.username);
            user1.socket.send(JSON.stringify({ event: "competitionStart", data: { opponent: user2.username, link: competition } }));
            user2.socket.send(JSON.stringify({ event: "competitionStart", data: { opponent: user1.username, link: competition } }));
            pollSubmissions(user1.username, user2.username, competition);
            return res.json({ message: "Competition started" });
        }
    }
    catch (error) {
        console.error("Error processing request:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = addQueueRouter;
