import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  getOrders,
} from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/auth.js";

const OrderRouter = express.Router();

//Pegar Pedidos por usuário
OrderRouter.get("/", protect, getOrders);

//Pegar pedido unico
OrderRouter.get("/:id", protect, getOrder);

//Pegar pedido do carrinho
OrderRouter.post("/", protect, createOrder);

//Pegar status do pedido (ADMIN)
OrderRouter.put("/:id/status", protect, authorize("admin"), updateOrderStatus);

//Pegar todos pedidos (ADMIN)
OrderRouter.get("/admin/all", protect, authorize("admin"), getAllOrders);

export default OrderRouter;
