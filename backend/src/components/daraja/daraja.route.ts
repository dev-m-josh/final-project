import express from "express";
import { stkPushController, mpesaCallbackController } from "./daraja.controller";

const darajaRouter = express.Router();

darajaRouter.post("/stk-push", stkPushController);
darajaRouter.post("/callback", mpesaCallbackController);

export default darajaRouter;
