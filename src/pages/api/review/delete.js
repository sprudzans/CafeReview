import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Review from "../../../models/Review";

const handler = nc()
    .use(auth)
    .use(async (req, res) => {
        if (!req.user) return  res.json({message: "Пользователь не авторизован"});
        if(!req.body.id) return  res.json({message: "ID отзыва не передан"});

        await dbConnect()

        const review = await Review.findById(req.body.id);

        if(review.user.toString() === req.user.id) review.remove();
        else return res.json({message: "Доступ запрещен"});

        res.status(200).json('success');
    })

export default handler;