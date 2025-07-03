// src/routes/payments.route.ts
import express from "express";
import * as paymentsController from "./payment.controller";

const paymentRouter = express.Router();

paymentRouter.get("/", paymentsController.getAllPayments);
paymentRouter.get("/:id", paymentsController.getPaymentById as any);
paymentRouter.post("/", paymentsController.createPayment);
paymentRouter.patch("/:id", paymentsController.updatePayment as any);
paymentRouter.delete("/:id", paymentsController.deletePayment as any);
paymentRouter.get("/user/:userId", paymentsController.getPaymentsByUserId as any);

export default paymentRouter;
