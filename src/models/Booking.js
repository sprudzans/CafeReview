import mongoose, {Schema} from "mongoose";

const bookingSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    cafe: {type: Schema.Types.ObjectId, ref: 'Cafe', required: true},
    phone: {type: String, required: true},
    person: {type: Number, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true}
})

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

export default Booking;
