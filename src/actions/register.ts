"use server";

import { createUser } from "@/db/user";
import { signJwt } from "@/auth/jwt";
import { compileActivationTemplate, sendMail } from "@/mail/mail";
import { RegisterPayload } from "@/validators/registerSchema";
import { genSaltSync, hash } from "bcryptjs";

export async function registerAction(
  user: Omit<RegisterPayload, "accepted" | "confirmPassword">,
) {
  try {
    // Hashage du mot de passe avant l'enregistrement
    const hashedPassword = await hash(user.password, genSaltSync(10));

    // Création de l'utilisateur dans la base de données
    const newUser = await createUser(user, hashedPassword);

    if (!newUser) throw new Error("Échec de la création de l'utilisateur");

    // Génération du JWT pour l'utilisateur
    const jwtUserId = signJwt({ id: newUser.id });
    const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;

    // Compilation du modèle de l'email d'activation
    const body = compileActivationTemplate(user.firstname, activationUrl);

    // Envoi de l'email d'activation
    await sendMail({ to: user.email, subject: "Activez votre compte", body });

    return newUser;
  } catch (error) {
    console.error("Erreur lors de l'inscription", error);
    throw new Error("L'inscription a échoué");
  }
}
