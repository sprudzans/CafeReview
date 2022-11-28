import MongoStore from 'connect-mongo';
import nextSession from 'next-session';
import { promisifyStore } from 'next-session/lib/compat';

const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    stringify: false,
});

export const getSession = nextSession({
    store: promisifyStore(mongoStore),
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 2 * 7 * 24 * 60 * 60, // 2 weeks,
        path: '/',
        sameSite: 'strict',
    },
    touchAfter: 7 * 24 * 60 * 60, // 1 week
});

export default async function session(req, res, next) {
    await getSession(req, res);
    next();
}