import session from "../libs/session";
import passport from "../libs/passport";

function nextAuth(req) {
    return new Promise(async (resolve, reject) => {
        await session(req, {}, _ => _)
        passport.initialize()(req, {}, _ => _)
        passport.session()(req, {}, (err) => {
            if (err) reject(err)
            else req.user ? resolve(req.user) : resolve(false)
        })
    });
}

export default nextAuth