import passport from "passport";
import LocalStrategy from "passport-local";

import dbConnect from "./dbConnect";
import User from "../models/User"

passport.serializeUser((user, done) => {
    done(null, user._id.toString())
})

passport.deserializeUser( async (id, done) => {
    await dbConnect();
    const userData = await User.findById(id).lean()
    if (userData) {
        const {avatar, username, email, favorite} = userData
        done(null, {id, avatar, username, email, favorite});
    }
    else done(null, false, 'Пользователь не найден');
})

passport.use(
    new LocalStrategy(async (username, password, done) => {
        await dbConnect();
        const user = await User.findOne({username});
        if ( user && user.validatePassword(password) ){
            const {_id, avatar,  username, favorite, email} = user;
            return done(null, {_id: _id.toString(), avatar,  username, favorite, email})
        } else if (!user) {
            return done(null, false, 'Пользователь не найден')
        } else {
            return done(null, false, 'Пароль не корректный')
        }
    })
)

export default passport