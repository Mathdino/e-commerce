import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middleware/upload.js";
import { protect, authorize } from "../middleware/auth.js";

const ProductsRouter = express.Router();

//Pega todos produtos (GET /api/products)
ProductsRouter.get("/", getProducts);

//Pega produto unico (GET /api/products/:id)
ProductsRouter.get("/:id", getProduct);

// Criar Produto (POST /api/products)
ProductsRouter.post(
  "/",
  upload.array("images", 5),
  protect,
  authorize("admin"),
  createProduct,
);

//Atualizar produto (PUT /api/products/:id)
ProductsRouter.put(
  "/:id",
  upload.array("images", 5),
  protect,
  authorize("admin"),
  updateProduct,
);

// Deletar produto (DELETE /api/products/:id)
ProductsRouter.delete("/:id", protect, authorize("admin"), deleteProduct);

export default ProductsRouter;
