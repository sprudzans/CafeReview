import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Comment from "../../../models/Comment"
import Cafe from "../../../models/Cafe";


const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if(!req.user) return res.json({message: "Пользователь не авторизован"})

        const {id, cafe} = req.body

        await dbConnect();

        await Comment.findByIdAndDelete(id)

        const commentArray = await Comment.find({cafe})

        const rating = commentArray.length && commentArray.reduce((a, b) => a + b.rating, 0) / commentArray.length

        await Cafe.findByIdAndUpdate(cafe, {rating})

        res.json({status: true});
    })


export default handler