const session = require('express-session');
const MongoStore = require('connect-mongo');

const {uri} = require('./database');

const {SECRET, DB_NAME} = process.env;

const sessionManager = session({
    resave: true,
    saveUninitialized: true,
    secret: SECRET,
    store: MongoStore.create({
        mongoUrl: uri,
        db: DB_NAME,
        clear_interval: 3600
    }),
    cookie: {
        maxAge: 30 * 60 * 1000
    }
});

module.exports = {sessionManager};