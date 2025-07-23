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

darajaRouter.post("/*", (req: Request, res: Response) => {
    console.log("Received Daraja callback at:", req.originalUrl);
    console.dir(req.body, { depth: null });
    res.status(200).send("OK");
});

export default darajaRouter;
