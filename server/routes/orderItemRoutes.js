import express from "express";
import {
  getAllOrderItems,
  addOrderItem,
  updateOrderItem,
  deleteOrderItem
} from "../controllers/orderItemController.js";

const router = express.Router();

router.get("/", getAllOrderItems);
router.post("/", addOrderItem);
router.put("/:order_item_id", updateOrderItem);
router.delete("/:order_item_id", deleteOrderItem);

export default router;
