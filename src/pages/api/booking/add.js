import nc from 'next-connect';
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Booking from "../../../models/Booking";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return  res.json({message: "Пользователь не авторизован"})
        const user = req.user.id

        const {cafe, phone, person, date, time} = req.body
        if (!cafe || !phone || !person || !date || !time) return res.json({message: "Не все данные переданы"});

        await dbConnect();
        await Booking.create({user, cafe, phone, person, date, time})

        res.status(200).json('success')
    })

export default handler;