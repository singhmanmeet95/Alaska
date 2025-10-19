import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// JWT Strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            image: true,
            about: true,
            bio: true,
          },
        });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await prisma.user.findFirst({
          where: { email: profile.emails[0].value },
        });

        if (user) {
          return done(null, user);
        } else {
          // Create new user
          const newUser = await prisma.user.create({
            data: {
              name: profile.displayName,
              username:
                profile.emails[0].value.split("@")[0] + "_" + Date.now(),
              email: profile.emails[0].value,
              password: "oauth_user", // Placeholder password for OAuth users
              image: profile.photos[0]?.value,
              about: `User authenticated via Google OAuth`,
            },
          });

          return done(null, newUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        image: true,
        about: true,
        bio: true,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
