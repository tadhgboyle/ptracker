const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GOOGLE_CALLBACK_URL = 'http://localhost:9000/auth/google/callback';

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        const user = await prisma.user.upsert({
            where: {
                googleId: profile.id,
            },
            create: {
                name: profile.displayName,
                picture: profile.photos[0].value,
                email: profile.emails[0].value,
                googleId: profile.id,
            },
            update: {
                name: profile.displayName,
                picture: profile.photos[0].value,
                email: profile.emails[0].value,
            },
        });
        console.log(user);
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    done(null, user);
});
