const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage, 
    dest: 'uploads/',
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
});

module.exports = upload;
