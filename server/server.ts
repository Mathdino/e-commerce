import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import conectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhook } from "./controllers/webhooks.js";
import makeAdmin from "./scripts/makeAdmin.js";
import ProductsRouter from "./routes/productsRoutes.js";

const db = conectDB();

const app = express();

//Conexão do MongoDB
await conectDB();

app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.use("/api/products", ProductsRouter);

await makeAdmin();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
