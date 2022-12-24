import { user } from "@lib/interfaces";
import jwt from "jsonwebtoken";

const config = process.env;

export class AuthService {

  public static async verifyToken(req: any, res: any, next: any) {
    const token =
      req.body?.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  }

}
