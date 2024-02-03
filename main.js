const http = require('http');
const express = require('express');

const {NODE_PORT} = process.env;

const {oauth, authorizationUri} = require('./source/oauth');
const {logger} = require('./source/logs');
const database = require('./source/database');
const {login, register, logout, authorize} = require('./source/login');
const {sessionManager} = require('./source/session');
const {uploadMiddleware} = require('./source/upload');
const products = require('./source/products');

let app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.set('etag', false);

app.use(express.urlencoded({extended: true}));
app.use(express.static('./static'));
app.use(sessionManager);

app.get('/', products.search, (req, res) => res.render('landing', {
    session: req.session,
    products: req.products
}));

app.get('/login', (_, res) => res.render('login', {google: authorizationUri}));
app.post('/login', login);

app.get('/register', (_, res) => res.render('register'));
app.post('/register', register);

app.get('/logout', logout);

app.get('/new-product', authorize('admin'), (_, res) => res.render('new-product'));
app.post('/new-product', authorize('admin'), uploadMiddleware('image'), products.newProduct);

app.get('/product/:id', products.viewProduct);
app.get('/add-to-cart/:id', authorize('user'), products.addToCart);
app.get('/delete/:id', authorize('admin'), products.deleteProduct);
app.get('/edit/:id', authorize('admin'), products.getEditProduct);
app.post('/edit/:id', authorize('admin'), uploadMiddleware('image'), products.postEditProduct);

app.get('/oauth', oauth);

(async function main() {
    logger.info('Server start');
    try {
        await database.connect();
        logger.info('Connected to MongoDB')
        http.createServer(app).listen(NODE_PORT);
        logger.info(`Server running on http://localhost:${NODE_PORT}`);
    } catch (err) {
        logger.error(`Server could not start: ${err}`)
    }
})();

