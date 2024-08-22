"use server";

import prisma from "../prisma";
import { RegisterPayload } from "@/validators/registerSchema";
import { hash, genSaltSync } from "bcryptjs";
import { compileActivationTemplate, sendMail } from "../mail";
import { signJwt, verifyJwt } from "../jwt";
import { findOneUser } from "@/data/user";

export async function registerAction(
  user: Omit<RegisterPayload, "accepted" | "confirmPassword">,
) {
  try {
    // Hash du mot de passe avant l'enregistrement
    const hashedPassword = await hash(user.password, genSaltSync(10));

    // Création de l'utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    // Génération du JWT pour l'utilisateur
    const jwtUserId = signJwt({ id: newUser.id });
    const activationUrl = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;

    // Compilation du template de l'email d'activation
    const body = compileActivationTemplate(user.firstname, activationUrl);

    // Envoi de l'email d'activation
    await sendMail({ to: user.email, subject: "Activate Your Account", body });

    return newUser;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error("Registration failed");
  }
}

type ActivateUserFunc = (
  jwtUserId: string,
) => Promise<"userNotExist" | "alreadyActivated" | "success" | "error">;

export const activateUserAction: ActivateUserFunc = async (jwtUserId) => {
  try {
    // Vérification du JWT
    const payload = verifyJwt(jwtUserId);
    if (!payload || !payload.id) {
      return "userNotExist";
    }

    // Récupération de l'utilisateur dans la base de données
    const user = await findOneUser({ id: payload.id });

    if (!user) return "userNotExist";
    if (user.emailVerified) return "alreadyActivated";

    // Mise à jour de l'utilisateur pour indiquer que l'email est vérifié
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    return "success";
  } catch (error) {
    console.error("Activation error:", error);
    return "error";
  }
};
