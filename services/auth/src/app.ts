import dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import { googleStrategy } from "./google/google.auth.js";
import signInWithGoogleController from "./google/controller.js";
import pino from "pino";

const app = express();
const port = 3000;
const logger = pino({
  mixin() {
    return { requestId: "1" };
  },
});

// bodyparse to parse req.body
app.use(express.json());

// Healthcheck endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.use(passport.initialize());

passport.use(googleStrategy);

app.use("/oauth/google", signInWithGoogleController);

app.use((err, req, res, next) => {
  if (err) logger.error(err);
  res.status(500).json({
    status: "error",
    message: "something went wrong",
  });
});
