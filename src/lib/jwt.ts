import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

interface SignOption extends SignOptions {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1d",
};

export function signJwt(
  payload: JwtPayload,
  option: SignOption = DEFAULT_SIGN_OPTION,
): string {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey)
    throw new Error("WT_SECRET is not defined in environment variables.");

  const token = jwt.sign(payload, secretKey, option);
  return token;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey)
      throw new Error("WT_SECRET is not defined in environment variables.");

    const decoded = jwt.verify(token, secretKey);
    return decoded as JwtPayload;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}
