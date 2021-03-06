import express from "express";
import fetch from "node-fetch";
import asyncHandler from "express-async-handler";
import { variables } from "../log.js";

const router = express.Router();

const CLIENT_ID = variables.DISCORD_CLIENT_ID;
const CLIENT_SECRET = variables.DISCORD_CLIENT_SECRET;

const redirect = variables.REDIRECT;

const FRONTEND_URL = variables.oauthCallback;

router.get("/login", (req, res) => {
  res.redirect(
    `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify%20email%20guilds%20guilds.members.read&response_type=code&redirect_uri=${redirect}`
  );
});

router.get(
  "/callback",
  asyncHandler(async (req, res) => {
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: redirect,
      code: req.query.code,
      scope: ["identify", "email", "guilds", "guilds.members.read"],
    };

    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: new URLSearchParams(data),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const json = await response.json();

    const fetchDiscordUserInfo = await fetch(
      "http://discordapp.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${json.access_token}`,
        },
      }
    );
    const userInfo = await fetchDiscordUserInfo.json();

    res.redirect(`${FRONTEND_URL}/join-the-hunt?token=${json.access_token}`);

    console.log(userInfo);
  })
);

export default router;
