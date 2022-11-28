import mongoose, {Schema} from "mongoose";
import crypto from 'node:crypto'

const userSchema = new Schema({
    avatar: {type: String, default: ''},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    salt: {type: String},
    email: {type: String, required: true},
    favorite: [String]
}, {
    timestamps: true
})

userSchema.pre('save', function (next){
    this.salt = crypto.randomBytes(16).toString('hex')
    this.password = crypto
        .pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512')
        .toString('hex')
    next()
})

userSchema.methods.validatePassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
        .toString('hex')
    return this.password === hash
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User;