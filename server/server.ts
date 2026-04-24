import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import conectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import ProductsRouter from "./routes/productsRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/ordersRoute.js";
import AddressRouter from "./routes/addressRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
import { seedProducts } from "./scripts/seedProducts.js";

const app = express();

//Conexão do MongoDB
await conectDB();

app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/products", ProductsRouter);

app.use("/api/cart", CartRouter);

app.use("/api/orders", OrderRouter);

app.use("/api/addresses", AddressRouter);

app.use("/api/admin", AdminRouter);

await makeAdmin();

// Seed Products
// await seedProducts(process.env.MONGODB_URL as string);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
