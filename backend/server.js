import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import colors from "colors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import discordRoutes from "./routes/discordRoutes.js";
import twitterRoutes from "./routes/twitterRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cors from "cors";

connectDB();

const app = express();

app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser());

app.use("/api/twitter", twitterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discord", discordRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

let variables = {
  oauthCallback: process.env.oauthCallback,
  CONSUMER_SECRET: process.env.CONSUMER_SECRET,
  CONSUMER_KEY: process.env.CONSUMER_KEY,
  REDIRECT: process.env.REDIRECT,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  server: process.env.SERVER,
  role: process.env.ROLE,
  BEARER_TOKEN: process.env.BEARER_TOKEN,
};
module.exports = variables;

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
