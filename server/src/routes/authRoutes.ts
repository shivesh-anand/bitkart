import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user?.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.redirect(`${process.env.FRONTEND_URL}/google-auth?token=${token}`);
  }
);

export default router;
