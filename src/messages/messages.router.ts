import express from "express";
import { validateAccessToken } from "../middleware/auth0.middleware";
import {
  getAdminMessage,
  getProtectedMessage,
  getPublicMessage,
} from "./messages.service";
import { expressjwt as jwt } from "express-jwt";

export const messagesRouter = express.Router();

messagesRouter.get("/public", (req, res) => {
  const message = getPublicMessage();

  res.status(200).json(message);
});

messagesRouter.get("/protected", validateAccessToken, (req, res) => {
  const message = getProtectedMessage();

  res.status(200).json(message);
});

messagesRouter.get("/admin", validateAccessToken, (req, res) => {
  const message = getAdminMessage();

  res.status(200).json(message);
});

messagesRouter.get(
  "/scopes", 
  jwt({ 
    secret: process.env.SESSION_TOKEN_SECRET ?? "unknown", 
    algorithms: ["HS256"],
    getToken: (req: express.Request) => {
      let token: string = '';

      if (req.query && req.query.session_token) {
        token = req.query.session_token as string;
      }

      return token;
    }
  }),
  (req, res) => {
    res.status(200).json(req.auth);
  }
);
