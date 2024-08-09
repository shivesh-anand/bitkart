import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/userModel.js";

const GOOGLE_CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID || "your_google_client_id";
const GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "your_google_client_secret";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/v1/auth/google/callback`,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const email = profile.emails?.[0].value || "";
        if (!email.endsWith("@bitmesra.ac.in")) {
          return done(
            "Invalid email domain, use email with @bitmesra.ac.in",
            false
          );
        }
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email: profile.emails?.[0].value || "",
          });
        }
        console.log("User created/saved:", user);
        done(null, user);
      } catch (err) {
        //console.log(err);
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
