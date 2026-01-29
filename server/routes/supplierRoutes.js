import express from "express";
import {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierCount
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.post("/", addSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);
router.get("/count/all", getSupplierCount);

export default router;
