import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import {
  getAllCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerCount
} from "../controllers/customerController.js";


const router = express.Router();

router.get("/", verifyToken, getAllCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.post("/", verifyToken, addCustomer);
router.put("/:customer_id", verifyToken, updateCustomer);
router.delete("/:customer_id", verifyToken, deleteCustomer);
router.get("/count/all", getCustomerCount);

export default router;
