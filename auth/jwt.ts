import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
const SECRET = process.env.SECRET || "strawberryshortcake"; // This can be any random string, longer is better (safer)

interface TokenInfo extends JwtPayload {
  userId: number;
}

export const toToken = (data: TokenInfo) => {
  const token = jwt.sign(data, SECRET, { expiresIn: "14 days" });
  return token;
};

export const toData = (token: string) => {
  const data = jwt.verify(token, SECRET) as TokenInfo;
  return data;
};
