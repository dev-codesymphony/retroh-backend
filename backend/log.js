import dotenv from "dotenv";
dotenv.config();

export let variables = {
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
