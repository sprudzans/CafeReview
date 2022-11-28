import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Review from "../../../models/Review";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return res.json({message: "Пользователь не авторизован"})
        if (!req.body.id) return res.json({message: "ID отзыва отсутствует"})
        if (!req.body.update) return res.json({message: "Новые данные не указаны"})

        const {id, update} = req.body

        await dbConnect()

        const model = await Review.findById(req.body.id)

        if (!model) return res.json({message: "Объект не найден"});
        if (model.user.toString() !== req.user.id) return res.json({message: "Доступ запрещен"});

        const updReview = await Review.findByIdAndUpdate(id, update)

        res.json({review: updReview._id})
    })

export default handler