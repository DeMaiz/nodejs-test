import * as multer from 'multer';
import { resolve } from 'url';

let storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
        console.log("File Name =>",file.originalname);
        cb(null, file.originalname);
    }
});
module.exports = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'text/csv') {
            return cb(null, true);
        } else {
            let err = new Error();
            err.name = 'MLError';
            err.message = 'Please upload the file of type CSV' || null;
            return cb(err, false);
        }
    }
});