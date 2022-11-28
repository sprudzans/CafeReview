import nc from "next-connect"
import passport from "../../../libs/passport";
import auth from "../../../middlewares/auth";

function onError(err, req, res) {
    res.status(200).json({message: err})
}

const passportWrapper = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        err && next(err)

        if (user) {
            req.logIn(user, (err) => {
                err && next(err)
                next()
            })
        } else next(info);
    })(req, res, next)
}

const handler = nc({onError})
    .use(auth)
    .post(passportWrapper,
        (req, res) => {
            const {avatar, username, email, favorite} = req.user
            res.status(200).json({avatar, username, email, favorite})
        })

export default handler;