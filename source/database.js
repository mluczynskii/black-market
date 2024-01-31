const mongoose = require('mongoose');

const {DB_USER, DB_PASSWORD, DB_HOST, DB_NAME} = process.env;

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`

const connect = () => mongoose.connect(uri);  

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    roles: [String]
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    product: String,
    price: Number,
    filename: String
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
    email: String,
    products: [String],
    total: Number
});
const Order = mongoose.model('Order', orderSchema);

module.exports = {connect, uri, User, Product, Order};
