import express from 'express';
import cors from "cors";
import { app, server, wss } from "./socket"; // Import app, server, and wss from socket.ts
import rootRouter from "./routes/index";

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

const PORT1 = process.env.PORT1 || 3001;

server.listen(PORT1, () => {
  console.log(`Server is running on port ${PORT1}`);
});
