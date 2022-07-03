import { Router } from "express";
import passport from "passport";
import { refreshTokens, validateAccessToken, validateIdToken } from "./google.auth.js";
import dotenv from "dotenv";
import pino from "pino";

const logger = pino();


dotenv.config();

const { CLIENT_ID: clientId, CLIENT_SECRET: clientSecret } = process.env;

const signInWithGoogleController = Router();

signInWithGoogleController.get(
  "/login",
  passport.authenticate("google", {
    session: false,
    accessType: "offline",
    prompt: "consent",
  })
);

signInWithGoogleController.get(
  "/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
    session: false,
    accessType: "offline",
    prompt: "consent",
  }),
  function (req, res) {
    res.send("You did it!");
  }
);

signInWithGoogleController.post("/refresh",async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const data = await refreshTokens(clientId, clientSecret, refreshToken);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
});

signInWithGoogleController.post("/accessToken/validate", async (req, res, next) => {
  try {
    logger.debug("POST /accessToken/validate");
    const { accessToken } = req.body;
    const data = await validateAccessToken(accessToken);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
});

signInWithGoogleController.post("/idToken/validate", async (req, res, next) => {
  try {
    logger.debug("POST /idToken/validate");
    const { idToken } = req.body;
    const data = await validateIdToken(idToken);
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
});

export default signInWithGoogleController;
