const {Product} = require('./database');
const {logger} = require('./logs');

async function search(req, res, next) {
    const search = req.query.search;
    const filter = {
        product: search ? new RegExp(search, 'i') : /.*/
    };
    const products = await Product.find(filter).exec();
    req.products = products;
    next();
}

async function viewProduct(req, res) {
    var product;
    try { product = await Product.findById(req.params.id).exec(); }
    catch(err) { product = {} };
    res.render('view-product', {
        product, 
        admin: req.session.admin
    });
}

module.exports = {search, viewProduct};