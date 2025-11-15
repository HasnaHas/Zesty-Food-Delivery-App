import express from "express";
import { addPromo, removePromo, listAll, applyPromo } from "../controllers/promoController.js";
import authMiddleware from "../middleware/auth.js";

const promoRouter = express.Router();

promoRouter.post("/add", authMiddleware, addPromo);
promoRouter.post("/remove", authMiddleware, removePromo);
promoRouter.get("/listall", listAll);
promoRouter.post("/apply", authMiddleware, applyPromo);

export default promoRouter;
