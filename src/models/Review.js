import mongoose, {Schema} from "mongoose"

const reviewSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    cafe: {type: Schema.Types.ObjectId, ref: 'Cafe', required: true},
    title: {type: String, required: true}, 
    desc: {type: String, required: true}
})

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

export default Review;
