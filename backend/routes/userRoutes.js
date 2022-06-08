import express from "express";
const router = express.Router();
import {
  create,
  find,
  patch,
  get,
  verifyDiscord,
  twitterFollowed,
  twitterRetweeted,
  twitterTweetedHandle,
  tokenStringValid,
  generateTokenString,
  expireTokenString,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(find).post(create).patch(protect, patch);
router.route("/verifyDiscord").post(protect, verifyDiscord);
router.route("/expireTokenString").post(protect, expireTokenString);
router.route("/tokenStringValid").post(protect, tokenStringValid);
router.route("/generateTokenString").post(protect, generateTokenString);
router.route("/twitterFollowed").post(protect, twitterFollowed);
router.route("/twitterTweetedHandle").post(protect, twitterTweetedHandle);
router.route("/twitterRetweeted").post(protect, twitterRetweeted);
router.route("/profile").get(protect, get);

export default router;
