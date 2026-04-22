import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import conectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";

const db = conectDB();

const app = express();

//Conexão do MongoDB
await conectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
