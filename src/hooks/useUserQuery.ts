import { registerAction } from "@/lib/actions/authAction";
import useShowToast from "./useShowToast";
import { RegisterPayload } from "@/validators/registerSchema";
import {
  LoginPayload,
  UpdateEmailPayload,
  UpdatePasswordPayload,
} from "@/validators/loginSchema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  updateEmailAction,
  updatePasswordAction,
} from "@/lib/actions/profileAction";
import { useStore } from "@/store/useStore";

export const useUserQuery = () => {
  const { showToast } = useShowToast();
  const { setCurrentUser } = useStore();

  const router = useRouter();
  const registerUser = async (data: RegisterPayload) => {
    {
      const { accepted, confirmPassword, ...user } = data;
      try {
        const newUser = await registerAction(user);
        showToast({
          title: "Inscription réussie",
          description:
            "un email de confirmation a été envoyé sur votre boite mail",
          variant: "default",
          redirectTo: "/auth/login",
        });
        return newUser;
      } catch (error) {
        showToast({
          description: "Une erreur est survenue lors de l'inscription",
          variant: "destructive",
        });

        console.error("Error registering user:", error);
      }
    }
  };

  const loginUser = async (data: LoginPayload, callbackUrl?: string) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (!result?.ok) {
      showToast({
        description: result?.error as string,
        variant: "destructive",
      });

      return;
    }
    showToast({
      description: "Connexion réussie",
      variant: "default",
      redirectTo: "/",
    });
    router.push(callbackUrl ? callbackUrl : "/");
  };

  const updateEmail = async ({ userId, email }: UpdateEmailPayload) => {
    {
      try {
        const newUser = await updateEmailAction({ userId, email });
        showToast({
          description: "Email mis à jour",
          variant: "default",
        });
        setCurrentUser(newUser);
        return newUser;
      } catch (error) {
        showToast({
          description: "Une erreur est survenue lors de la mise à jour",
          variant: "destructive",
        });

        console.error("Error registering user:", error);
      }
    }
  };

  const updatePassword = async ({
    userId,
    password,
    newPassword,
  }: UpdatePasswordPayload) => {
    {
      try {
        const newUser = await updatePasswordAction({
          userId,
          password,
          newPassword,
        });
        showToast({
          description: "Mot de passe mis à jour",
          variant: "default",
        });
        setCurrentUser(newUser);
        return newUser;
      } catch (error) {
        showToast({
          description: "Une erreur est survenue lors de la mise à jour",
          variant: "destructive",
        });

        console.error("Error registering user:", error);
      }
    }
  };

  return { registerUser, loginUser, updateEmail, updatePassword };
};
