import express from 'express';
import signUpRouter from "./signup";
import signInRouter from "./signin";
import addQueueRouter from "./addqueue";

const router = express.Router();

router.use("/signup", signUpRouter);
router.use("/signin", signInRouter);
router.use("/addqueue", addQueueRouter);

export default router;
