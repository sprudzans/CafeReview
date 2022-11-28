import nc from "next-connect"
import auth from "../../../middlewares/auth";

const handler = nc()
    .use(auth)
    .post( async (req, res) => {
        if (req.user) {
            await req.logout()
            res.status(200).json({text: "logout completed"})
        } else {
            res.status(200).json({text: "already logout"})
        }
    })

export default handler;