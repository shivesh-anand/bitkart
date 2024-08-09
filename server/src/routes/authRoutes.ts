import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../config/passportConfig.js";
import {
  loginController,
  registerController,
  resendOtpController,
  verifyOtpController,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/verify-otp/:id", verifyOtpController);
router.post("/login", loginController);
router.post("/resend-otp", resendOtpController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user?.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const user = req.user as {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      _id: string;
      googleId: string;
    };
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const email = user?.email;
    const _id = user?._id;
    const googleId = user?.googleId;

    const redirectUrl = `${process.env.FRONTEND_URL}/google-auth?token=${token}&firstName=${firstName}&lastName=${lastName}&email=${email}&_id=${_id}&googleId=${googleId}`;
    //console.log("Redirect URL:", redirectUrl);
    res.redirect(redirectUrl);
  }
);

export default router;
