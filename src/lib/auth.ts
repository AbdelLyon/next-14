import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";
import { findOneUser } from "@/data/user";

const credentials = {
  email: { label: "Email", type: "email", placeholder: "Your email" },
  password: {
    label: "Password",
    type: "password",
    placeholder: "Your password",
  },
};

const authenticate = async (
  credentials: Record<"email" | "password", string>,
) => {
  const user = await findOneUser({ email: credentials.email });

  if (!user) {
    throw new Error("User name or password is not correct");
  }

  const isPasswordCorrect = await compare(credentials.password, user.password);

  if (!isPasswordCorrect) {
    throw new Error("User name or password is not correct");
  }

  if (!user.emailVerified) throw new Error("Please verify your email first!");

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials,
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        return authenticate(credentials);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },
    async session({ token, session }) {
      if (session && token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
};
