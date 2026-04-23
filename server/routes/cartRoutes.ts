import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const CartRouter = express.Router();

// Pegar Carrinho (GET /api/cart)
CartRouter.get("/", protect, getCart);

// Adicionar ao carrinho (POST /api/cart/add)
CartRouter.post("/add", protect, addToCart);

// Atualizar item do carrinho (PUT /api/cart/item/:productId)
CartRouter.put("/item/:productId", protect, updateCartItem);

// Remover item do carrinho (DELETE /api/cart/item/:productId)
CartRouter.delete("/item/:productId", protect, removeCartItem);

// Limpar carrinho (DELETE /api/cart)
CartRouter.delete("/", protect, clearCart);

export default CartRouter;
