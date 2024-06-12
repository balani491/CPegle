import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import rootRouter from "./routes/index";
import { queue } from './routes/addqueue';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const userSockets: Map<string, WebSocket> = new Map();
const paired: Map<string, string> = new Map();


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
            user2Socket.send(JSON.stringify({ event: 'messageReceive', data: { username:user1,message } }));
          }
        } else {
          console.error(`User not paired: ${user1}`);
        }
      }  
      if(event=='messaageReceive'){
        console.log(`Message received: ${data.message}`);
      } 
  
      if (event === 'competitionStart') {
          console.log(`Competition started with
             ${data.opponent}. Problem link: ${data.link}`);
        }
      if(event === 'winner'){
        console.log(`Winner is ${data.winner}`);
      }
      if(event === 'timeout'){
        console.log(`Timeout: ${data.message}`);
      }
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      let user:any;
      userSockets.forEach((socket, username) => {
        if (socket === ws) {
          user = username;
          userSockets.delete(username);
        }
      });
      queue.forEach((element,index)=>{
        if(element.username==user){
          queue.splice(index,1);
        }
      })
    });
  });
  
  
export { app, server, wss ,userSockets,paired};
