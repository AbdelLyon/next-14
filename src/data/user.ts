import prisma from "@/lib/prisma";

export const findOneUser = async ({
  id,
  email,
}: {
  id?: string;
  email?: string;
}) => {
  try {
    return await prisma.user.findUnique({
      where: {
        ...(id ? { id } : { email }),
      },
    });
  } catch (error) {
    return null;
  }
};
