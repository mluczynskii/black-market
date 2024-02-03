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
    catch(err) { 
        logger.log(err);
        product = {};
    };
    res.render('view-product', {
        product, 
        admin: req.session.admin,
        message: req.query.message
    });
}

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

async function addToCart(req, res) {
    try {
        const {product, price} = await Product.findById(req.params.id).exec();
        let order = req.session.cart.order;
        if (order[product]) order[product]++;
        else order[product] = 1;
        req.session.cart.total += price;
        res.redirect(`/product/${req.params.id}?message=product-added-successfully`);
    } catch (err) {
        logger.error(err);
        res.redirect('/');
    }
}

async function deleteProduct(req, res) {
    try {
        await Product.deleteOne({_id: req.params.id});
        logger.info(`Deleted product with id ${req.params.id}`);
        res.redirect('/');
    } catch (err) {
        logger.error(err);
        res.redirect('/');
    }
}

async function getEditProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id).exec();
        res.render('edit-product', {product});
    } catch(err) {
        logger.error(err);
        res.redirect('/');
    }
}

async function postEditProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id).exec();
        Object.assign(product, {
            product: req.body.product,
            price: req.body.price,
            filename: req.file ? req.file.filename : product.filename
        });
        await product.save();
        logger.info(`Product with id: ${req.params.id} updated`);
        res.render('edit-product', {
            product,
            message: 'product-updated-successfully'
        })
    } catch (err) {
        logger.error(err);
        res.redirect('/');
    }
}

module.exports = {search, viewProduct, addToCart, deleteProduct, getEditProduct, postEditProduct, newProduct};