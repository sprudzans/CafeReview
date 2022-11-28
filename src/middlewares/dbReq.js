import mongoose from "mongoose";
import dbConnect from "../libs/dbConnect";
import Cafe from "../models/Cafe";
import Comment from "../models/Comment";
import Review from "../models/Review";
import Booking from "../models/Booking";

function docToStr (obj, arr) {
    arr.forEach(key => obj[key] = obj[key].toString())

    return obj
}

export async function getCafeArray (filter = {}) {
    await dbConnect()

    const cafeArray = await Cafe.find(filter).lean()

    return cafeArray.map(cafe => docToStr(cafe, ['_id', 'user']))
}

export async function getCafe (id) {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(id)) return false

    const cafeData = await Cafe.findById(id).lean();

    cafeData.comments = await getCommentArray({cafe: id});

    cafeData.reviews = await getReviewArray({cafe: id});

    return docToStr(cafeData, ['_id', 'user']);
}

export async function getReviewArray(filter = {}) {
    await dbConnect()

    const reviewArray = await Review.find(filter)
        .populate('user', 'username')
        .populate('cafe', 'title')
        .lean()

    return reviewArray.map(el => {
        const paragraphInDesc = JSON.parse(el.desc).blocks.find(el => el.type === 'paragraph')
        const text = paragraphInDesc ? paragraphInDesc.data.text : ""


        return {
            ...docToStr(el, ['_id']),
            user: docToStr(el.user, ['_id']),
            cafe: docToStr(el.cafe, ['_id']),
            text: text.length > 100 ? text.slice(0, 100) + "..." : text
        }
    })
}

export async function getReview (id) {
    await dbConnect()

    if (!mongoose.Types.ObjectId.isValid(id)) return false

    const reviewData = await Review.findById(id)
        .populate('cafe', ['title', 'image', 'cost', 'rating'])
        .lean()

    return {
        ...docToStr(reviewData, ['_id', 'user']),
        cafe: docToStr(reviewData.cafe, ['_id']),
    }
}

export async function getCommentArray(filter = {}) {
    const commentArray = await Comment.find(filter)
        .populate('user', ['avatar', 'username'])
        .lean()

    return commentArray.map(el => {
        return {
            ...docToStr(el, ['_id', 'cafe']),
            user: docToStr(el.user, ['_id'])
        }
    })
}

export async function getBookArray(filter = {}) {
    await dbConnect()
    const bookArray = await Booking.find(filter).populate('cafe', 'title').lean()

    return bookArray.map(el => {
        return {
            ...docToStr(el, ['_id', 'user']),
            cafe: docToStr(el.cafe, ['_id']),
        }
    })
}