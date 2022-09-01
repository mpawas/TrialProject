const res = require('express/lib/response');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const media_file = process.env.MEDIA_PATH


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `${media_file}${file.fieldname}`
        const newdir = path.join(media_file,file.fieldname)
        fs.mkdir(newdir, (err) => {
            if (err) {
                cb(null, dir);
            }else{
                cb(null, newdir);
            }
        })
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    },
})

const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    storage: storage
})

module.exports = upload