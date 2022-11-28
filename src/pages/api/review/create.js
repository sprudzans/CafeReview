import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Review from "../../../models/Review";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return res.json({message: "Пользователь не авторизован"});
        const user = req.user.id

        const { cafe, title, desc } = req.body;

        if (!cafe || !title || !desc) return res.json({message: "Не все данные заполнены"})

        await dbConnect();
        const newReview = await Review.create({user, cafe, title, desc})

        res.json({review: newReview._id})
    })

export default handler