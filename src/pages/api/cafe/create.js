import nc from 'next-connect';
import dbConnect from "../../../libs/dbConnect";
import Cafe from "../../../models/Cafe";
import auth from "../../../middlewares/auth";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return res.json({message: "Пользователь не авторизован"})
        const user = req.user.id

        const {title, cost, desc, image} = req.body

        await dbConnect()

        const newCafe = await Cafe.create({user, title, cost, desc, image});

        res.json({cafe: newCafe._id})
    })

export default handler