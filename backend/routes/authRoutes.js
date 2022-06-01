import express from "express";
const router = express.Router();
import { create } from "../controllers/authController.js";

router.route("/").post(create);

export default router;
