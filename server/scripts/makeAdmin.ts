import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

const makeAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    if (!email) return;

    /* Busca direto no Clerk pelo e-mail — não depende do webhook ter disparado */
    const { data: clerkUsers } = await clerkClient.users.getUserList({
      emailAddress: [email],
    });

    if (!clerkUsers || clerkUsers.length === 0) {
      console.log(`[makeAdmin] Usuário ${email} não encontrado no Clerk.`);
      return;
    }

    const clerkUser = clerkUsers[0];

    /* Atualiza publicMetadata no Clerk */
    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: { role: "admin" },
    });
    console.log(`[makeAdmin] Admin configurado no Clerk: ${clerkUser.id}`);

    /* Atualiza MongoDB também, se o usuário já existir lá */
    await User.findOneAndUpdate({ email }, { role: "admin" });
  } catch (error: any) {
    console.log("[makeAdmin] Falha:", error.message);
  }
};

export default makeAdmin;
