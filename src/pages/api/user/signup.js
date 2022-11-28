import nc from "next-connect";
import User from "../../../models/User";
import auth from "../../../middlewares/auth"
import dbConnect from "../../../libs/dbConnect";

const handler = nc()
    .use(auth)
    .post(async (req, res) => {
        const {username, password, email} = req.body;
        await dbConnect();

        const duplicateUsername = await User.findOne({username}).exec();
        if (duplicateUsername) {
            return res.status(200).json({message: "Пользователь с таким именем уже существует"})
        }

        const duplicateEmail = await User.findOne({email}).exec();
        if (duplicateEmail) {
            return res.status(200).json({message: "Пользователь с такой почтой уже существует"})
        }

        const user = await User.create({username, password, email})

        req.logIn(user, (err) => {
            if (err) throw err;
        });

        res.status(201).json({user: {username, email, favorite: []}});
    })

export default handler;