import express from "express";
import { lipaNaMpesaOnline } from "./daraja.controller";

const darajaRouter = express.Router();

// POST /api/daraja/stkpush
darajaRouter.post("/stkpush", lipaNaMpesaOnline as any);

export default darajaRouter;
