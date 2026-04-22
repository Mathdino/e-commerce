import { Response, Request } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/User.js";

export const clerkWebhook = async (req: Request, res: Response) => {
  // Verifica a variável de ambiente antes de qualquer coisa
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    console.error(
      "[Webhook] CLERK_WEBHOOK_SIGNING_SECRET não está configurado. " +
      "Adicione essa variável no Vercel: Dashboard → Settings → Environment Variables."
    );
    return res.status(500).json({ error: "Configuração de webhook ausente no servidor." });
  }

  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    console.log(`[Webhook] Evento recebido: ${evt.type}`);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = await User.findOne({ clerkId: evt.data.id });

      const userData = {
        name: (evt.data?.first_name ?? "") + " " + (evt.data?.last_name ?? ""),
        email: evt.data?.email_addresses[0]?.email_address,
        clerkId: evt.data.id,
        image: evt.data?.image_url,
      };

      if (user) {
        await User.findOneAndUpdate({ clerkId: evt.data.id }, userData);
        console.log(`[Webhook] Usuário atualizado: ${evt.data.id}`);
      } else {
        await User.create(userData);
        console.log(`[Webhook] Novo usuário criado: ${evt.data.id}`);
      }
    }

    return res.json({ success: true, message: "Webhook recebido" });
  } catch (err: any) {
    console.error("[Webhook] Falha na verificação:", err?.message ?? err);
    return res.status(400).json({ error: "Falha na verificação do webhook." });
  }
};
