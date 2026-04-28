import "dotenv/config";
import { clerkClient } from "@clerk/express";
import mongoose from "mongoose";
import User from "../models/User.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "mmtheus69@gmail.com";
const ADMIN_PASSWORD = "Mtheus@11";
const ADMIN_NAME = "Admin";

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URL as string);
  console.log("[createAdmin] MongoDB conectado");

  /* Verifica se já existe no Clerk */
  const { data: found } = await clerkClient.users.getUserList({
    emailAddress: [ADMIN_EMAIL],
  });

  let clerkUser;

  if (found.length > 0) {
    clerkUser = found[0];
    console.log(`[createAdmin] Usuário já existe no Clerk: ${clerkUser.id}`);

    /* Atualiza a senha para garantir que bate com a esperada */
    await clerkClient.users.updateUser(clerkUser.id, {
      password: ADMIN_PASSWORD,
      skipPasswordChecks: true,
    });
    console.log("[createAdmin] Senha atualizada no Clerk");
  } else {
    /* Cria o usuário no Clerk */
    clerkUser = await clerkClient.users.createUser({
      emailAddress: [ADMIN_EMAIL],
      password: ADMIN_PASSWORD,
      firstName: ADMIN_NAME,
      skipPasswordChecks: false,
    });
    console.log(`[createAdmin] Usuário criado no Clerk: ${clerkUser.id}`);
  }

  /* Define role admin no publicMetadata do Clerk */
  await clerkClient.users.updateUserMetadata(clerkUser.id, {
    publicMetadata: { role: "admin" },
  });
  console.log("[createAdmin] publicMetadata.role = admin definido no Clerk");

  /* Upsert no MongoDB */
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      clerkId: clerkUser.id,
      role: "admin",
    },
    { upsert: true, returnDocument: "after" },
  );
  console.log("[createAdmin] Usuário admin salvo/atualizado no MongoDB");

  console.log("\n✅ Admin pronto!");
  console.log(`   Email : ${ADMIN_EMAIL}`);
  console.log(`   Senha : ${ADMIN_PASSWORD}`);
  console.log(`   ClerkID: ${clerkUser.id}`);

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("[createAdmin] Erro:", err.message ?? err);
  process.exit(1);
});
