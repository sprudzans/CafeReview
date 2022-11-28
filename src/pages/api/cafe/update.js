import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Cafe from "../../../models/Cafe";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return res.json({message: "Пользователь не авторизован"})
        if (!req.body?.id) return res.json({message: "Кафе не указано"})

        const {id, title, cost, desc, image} = req.body

        await dbConnect()

        const model = await Cafe.findById(id)
        if (!model) return res.json({message: "Объект не найден"});

        if (model.user.toString() !== req.user.id) return res.json({message: "Доступ запрещен"});

        const updCafe = await Cafe.findByIdAndUpdate(id, {title, cost, desc, image})

        res.json({cafe: updCafe._id})
    })

export default handler