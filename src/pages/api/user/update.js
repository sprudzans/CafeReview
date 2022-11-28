import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import User from "../../../models/User";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return res.status(200).json({message: "Пользователь не авторизован"})

        if (!req.body) return res.status(200).json({message: "Запрос на обновление пуст"})

        await dbConnect();

        const update = {}

        if (req.body.avatar) update.avatar = req.body.avatar;
        if (req.body.favorite) update.favorite = req.body.favorite;

        if (req.body.username) {
            const duplicateUsername = await User.findOne({username: req.body.username}).lean().exec();
            if (duplicateUsername && duplicateUsername._id.toString() !== req.user.id) {
                return res.status(200).json({message: "Пользователь с таким именем уже существует"})
            }
            update.username = req.body.username
        }

        if (req.body.email) {
            const duplicateEmail = await User.findOne({email: req.body.email}).lean().exec();
            if (duplicateEmail && duplicateEmail._id.toString() !== req.user.id) {
                return res.status(200).json({message: "Пользователь с такой почтой уже существует"})
            }
            update.email = req.body.email
        }

        await User.findByIdAndUpdate(req.user.id, update).lean().exec()

        res.status(200).json(update)
    })

export default handler;