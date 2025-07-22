import express, { Request, Response } from "express";

import { lipaNaMpesaOnline } from "./daraja.controller";

const darajaRouter = express.Router();

// POST /api/daraja/stkpush
darajaRouter.post("/stkpush", lipaNaMpesaOnline as any);

// Daraja callback URL endpoint
darajaRouter.post("/payments/callback", (req: Request, res: Response) => {
  console.log("Callback received from Daraja:", req.body);
  res.status(200).send("Callback received");
});

export default darajaRouter;
