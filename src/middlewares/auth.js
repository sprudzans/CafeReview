import nc from 'next-connect'
import session from '../libs/session'
import passport from '../libs/passport'

const auth = nc()
    .use(session)
    .use(passport.initialize())
    .use(passport.session())

export default auth