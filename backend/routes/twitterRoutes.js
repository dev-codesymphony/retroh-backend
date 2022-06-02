import express from "express";
const router = express.Router();
import environment from "../environment.js";
const oauthCallback = environment.oauthCallback;
import oauth from "../lib/oauth-promise.js";
const x = oauth(oauthCallback);
const COOKIE_NAME = "oauth_token";

//our in-memory secrets database.
//Can be a key-value store or a relational database
let tokens = {};

//OAuth Step 1
router.post("/oauth/request_token", async (req, res) => {
  try {
    const { oauth_token, oauth_token_secret } = await x.getOAuthRequestToken();

    res.cookie(COOKIE_NAME, oauth_token, {
      maxAge: 15 * 60 * 1000, // 15 minutes
//       secure: true,
//       httpOnly: true,
//       sameSite: true,
    });

    tokens[oauth_token] = { oauth_token_secret };
    res.json({ oauth_token });
  } catch (error) {
    res.status(500).send(error);
  }
});

//OAuth Step 3
router.post("/oauth/access_token", async (req, res) => {
  try {
    const { oauth_token: req_oauth_token, oauth_verifier } = req.body;
    const oauth_token = req.cookies[COOKIE_NAME];
    const oauth_token_secret = tokens[oauth_token].oauth_token_secret;

    if (oauth_token !== req_oauth_token) {
      res.status(403).json({ message: "Request tokens do not match" });
      return;
    }

    const { oauth_access_token, oauth_access_token_secret } =
      await x.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier
      );
    tokens[oauth_token] = {
      ...tokens[oauth_token],
      oauth_access_token,
      oauth_access_token_secret,
    };
    res.json({ success: true });
  } catch (error) {
    res.status(403).json({ message: "Missing access token" });
  }
});

//Authenticated resource access
router.get("/users/profile_banner", async (req, res) => {
  try {
    const oauth_token = req.cookies[COOKIE_NAME];
    const { oauth_access_token, oauth_access_token_secret } =
      tokens[oauth_token];
    const response = await x.getProtectedResource(
      "https://api.twitter.com/1.1/account/verify_credentials.json",
      "GET",
      oauth_access_token,
      oauth_access_token_secret
    );
    res.json(JSON.parse(response.data));
  } catch (error) {
    res.status(403).json({ message: "Missing, invalid, or expired tokens" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const oauth_token = req.cookies[COOKIE_NAME];
    delete tokens[oauth_token];
    res.cookie(COOKIE_NAME, {}, { maxAge: -1 });
    res.json({ success: true });
  } catch (error) {
    res.status(403).json({ message: "Missing, invalid, or expired tokens" });
  }
});

export default router;
