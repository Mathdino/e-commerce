import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAddresses,
  updateAddress,
  deleteAddress,
  addAddress,
} from "../controllers/addressController.js";

const AddressRouter = express.Router();

// Pegar endereço do usuário
AddressRouter.get("/", protect, getAddresses);

// Pegar endereço do usuário
AddressRouter.post("/", protect, addAddress);

// Pegar endereço do usuário
AddressRouter.put("/:id", protect, updateAddress);

// Pegar endereço do usuário
AddressRouter.delete("/:id", protect, deleteAddress);

export default AddressRouter;
