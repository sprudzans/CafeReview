const express = require("express")
const multer = require("multer")
const cors = require("cors")
const {v4: uuidv4} = require ("uuid")

const PORT = 5000

const upload = multer({
    storage: multer.diskStorage({
        destination: './public',
        filename: (req, file, cb) => cb(null, uuidv4() + '.' + file.originalname.split('.').slice(-1)[0]),
    }),
    preservePath: false
});

express()
    .use(express.static('public'))
    .use(cors())
    .use(upload.any())
    .get('/', (req, res) => res.send('Server is working'))
    .post( '/', (req, res) => res.json({file: req.files[0].filename}))
    .listen(PORT)