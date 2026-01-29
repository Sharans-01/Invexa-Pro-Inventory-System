import express from "express";
import {
  getAllOrders,
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrderCount
} from "../controllers/orderController.js";
import verifyToken from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", verifyToken, getAllOrders);
router.get("/:id",verifyToken, getOrderById);
router.post("/", verifyToken,addOrder);
router.put("/:order_id", verifyToken,updateOrder);
router.delete("/:order_id",verifyToken, deleteOrder);
router.get("/count/all", getOrderCount);

export default router;
