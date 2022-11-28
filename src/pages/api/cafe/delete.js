import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Cafe from "../../../models/Cafe";

const handler = nc()
    .use(auth)
    .use(async (req, res) => {
        if (!req.user) return res.json({message: "Пользователь не авторизован"});
        if(!req.body.id) return res.json({message: "ID кафе не передан"});

        await dbConnect()

        const cafe = await Cafe.findById(req.body.id);

        if(cafe.user.toString() === req.user.id) cafe.remove();
        else return res.json({message: "Доступ запрещен"});

        res.status(200).json('success');
    })

export default handler;