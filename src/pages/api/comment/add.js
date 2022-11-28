import nc from "next-connect";
import auth from "../../../middlewares/auth";
import dbConnect from "../../../libs/dbConnect";
import Comment from "../../../models/Comment"
import Cafe from "../../../models/Cafe";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        if (!req.user) return res.json({message: "Пользователь не авторизован"});

        await dbConnect();

        const commentData = await Comment.create({...req.body, user: req.user.id});

        const cafe = req.body.cafe

        const commentArray = await Comment.find({cafe})

        const rating = commentArray.length && commentArray.reduce((a, b) => a + b.rating, 0) / commentArray.length

        await Cafe.findByIdAndUpdate(cafe, {rating})

        res.json({
            comment: {
                _id: commentData._id,
                text: req.body.text,
                rating: req.body.rating,
                user: {
                    _id: req.user.id,
                    avatar: req.user.avatar,
                    username: req.user.username
                }
            }
        });
    })


export default handler