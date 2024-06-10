import express from 'express';
import cors from "cors";
import rootRouter from "./routes/index";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", rootRouter);

const PORT1=process.env.PORT1 || 3001;

app.listen(PORT1);
