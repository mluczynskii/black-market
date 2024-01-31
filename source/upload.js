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

async function newProduct(req, res) {
    const product = new Product({
        product: req.body.product,
        price: req.body.price,
        filename: req.file.filename
    });
    await product.save();
    logger.info(`New product uploaded: ${req.body.product}`);
    res.render('new-product', {message: 'Product added successfully'});
}

module.exports = {uploadMiddleware, newProduct};