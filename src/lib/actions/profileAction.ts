"use server";
import {
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from "@/validators/loginSchema";
import prisma from "../prisma";
import { validateEmail } from "../utils";
import { compare, genSaltSync, hashSync } from "bcryptjs";
import { findOneUser } from "@/data/user";

export async function updateEmailAction({ userId, email }: UpdateEmailPayload) {
  if (!userId || !email) throw new Error("User ID and email are required");

  if (!validateEmail(email)) throw new Error("Invalid email format");

  try {
    // Vérifie si l'utilisateur existe
    const userExists = await findOneUser({ id: userId });

    if (!userExists) {
      throw new Error("User not found");
    }

    // Met à jour l'email de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
    });

    // Supprime le mot de passe de l'objet utilisateur avant de retourner
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error updating email:", error);
    throw new Error(
      "An error occurred while updating the email. Please try again later.",
    );
  }
}

export const updatePasswordAction = async ({
  userId,
  password,
  newPassword,
}: UpdatePasswordPayload) => {
  // Vérification des paramètres requis
  if (!userId || !password || !newPassword)
    throw new Error("User ID, current password, and new password are required");

  try {
    // Recherche de l'utilisateur dans la base de données
    const user = await findOneUser({ id: userId });

    if (!user || !user.password)
      throw new Error("User not found or password not set");

    // Vérification du mot de passe actuel
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) throw new Error("Current password is incorrect");

    const hashedPassword = hashSync(newPassword, genSaltSync(10));

    // Mise à jour du mot de passe de l'utilisateur dans la base de données
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Supprime le mot de passe de l'objet utilisateur avant de retourner
    const { password: _, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error(
      "An error occurred while updating the password. Please try again later.",
    );
  }
};
