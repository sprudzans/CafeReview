import nc from "next-connect";
import dbConnect from "../../libs/dbConnect";
import User from "../../models/User";
import Cafe from "../../models/Cafe";
import Review from "../../models/Review";
import Comment from "../../models/Comment";
import mock from "../../utils/mock.json"

const handler = nc()
    .get(async (req, res) => {
        await dbConnect()

        await User.deleteMany({})
        await Cafe.deleteMany({})
        await Comment.deleteMany({})
        await Review.deleteMany({})

        res.json('success')
    })
    .post(async (req, res) => {
        await dbConnect()

        const {userArray, cafeArray, commentArray, reviewArray} = mock

        const users = await Promise.all(userArray.map(async el => await User.create(el)))
        const cafe = await Promise.all(cafeArray.map(async (el, index) => await Cafe.create({...el, user: users[index]._id})))
        const comments = await Promise.all(commentArray.map(async (el, index) => await Comment.create({...el, user: users[index % 3]._id, cafe: cafe[index % 3]._id})))
        const reviews = await Promise.all(reviewArray.map(async (el, index) => await Review.create({...el, user: users[index]._id, cafe: cafe[index]._id})))

        await Promise.all(cafe.map(async el => {
            const curCom = comments.filter(item => item.cafe === el._id)
            const rating = curCom.length && curCom.reduce((a, b) => a + b.rating, 0) / curCom.length
            await Cafe.findByIdAndUpdate(el._id, {rating})
        }))

        res.json({users, cafe, comments, reviews})
    })

export default handler