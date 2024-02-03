const multer = require('multer');

const {Product} = require('./database');
const {logger} = require('./logs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ".jpg";
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({storage});

const uploadMiddleware = name => upload.single(name);

module.exports = {uploadMiddleware};