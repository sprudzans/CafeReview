import mongoose, {Schema} from "mongoose"

const cafeSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    image: {type: String, required: true},
    desc: {type: String, required: true},
    cost: {type: Number, required: true},
    rating: {type: Number}
})

const Cafe = mongoose.models.Cafe || mongoose.model('Cafe', cafeSchema)

export default Cafe;
