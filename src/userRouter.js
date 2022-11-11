import express from "express";
import { home, getJoin, postJoin, getLogin, postLogin } from "./userController";

const userRouter = express.Router();

// join, login, home(login or not)
userRouter.route("/join").get(getJoin).post(postJoin);
userRouter.route("/login").get(getLogin).post(postLogin);
userRouter.get("/", home);

export default userRouter;
