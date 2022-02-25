const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const User = require('../models/user');
const axios = require("axios");

let URL = process.env.APP_URL;
if (URL.endsWith('/')) {
    URL = URL.slice(0, -1);
}

const GOOGLE_CALLBACK_URL = URL + '/auth/google/callback';

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        const userExists = await prisma.user.findUnique({
            where: {
                googleId: profile.id,
            },
        });

        if (!userExists) {
            let URL = process.env.APP_URL;
            if (URL.endsWith('/')) {
                URL = URL.slice(0, -1);
            }
            // send post request, so it can send emails in "background"
            await axios.post(URL + '/email/newUser', {
                name: profile.displayName,
            });
        }

        const user = await prisma.user.upsert({
            where: {
                googleId: profile.id,
            },
            create: {
                name: profile.displayName,
                picture: profile.photos[0].value,
                email: profile.emails[0].value,
                googleId: profile.id,
                sectionId: 1,
            },
            update: {
                name: profile.displayName,
                picture: profile.photos[0].value,
                email: profile.emails[0].value,
            },
        });
        return done(null, user);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const checkUser = await prisma.user.findUnique({
        where: {id: parseInt(id)},
        include: {
            section: true,
            shift: true,
        },
    })
    if (checkUser) {
        done(null, await User.find(id))
    } else {
        // This line of code is for users that didn't exist previously in the database
        done(null, checkUser);
    }
});

module.exports = passport;
