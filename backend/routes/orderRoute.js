import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, submitReview, deleteOrder, userDeleteOrder } from "../controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/status",authMiddleware,updateStatus);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",authMiddleware,listOrders);
orderRouter.post("/submitreview",authMiddleware,submitReview);
orderRouter.post("/delete",authMiddleware,deleteOrder);
orderRouter.post("/userdelete",authMiddleware,userDeleteOrder);

export default orderRouter;
