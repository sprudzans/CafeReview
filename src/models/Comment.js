import mongoose, {Schema} from "mongoose"

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    cafe: {type: Schema.Types.ObjectId, ref: 'Cafe', required: true},
    rating: {type: Number, required: true},
    text: {type: String, required: true}
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)

export default Comment