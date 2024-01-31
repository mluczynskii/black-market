const {createHash} = require('crypto');

const {User} = require('./database');
const {authorizationUri} = require('./oauth');
const {logger} = require('./logs');

const {SALT} = process.env;
const saltHash = 
    createHash('sha512')
    .update(SALT, 'utf8')
    .digest('hex');

async function login(req, res) {
    const email = req.body.email;
    const password =
        createHash('sha512')
        .update(req.body.password)
        .update(saltHash)
        .digest('hex');
    const entry = await User.findOne({email, password}).exec();
    if (entry) {
        Object.assign(req.session, {
            user: entry.email,
            roles: entry.roles,
            cart: [],
            admin: entry.roles.includes('admin')
        });
        logger.info(`Successful login, email: ${email}`);
        if (req.session.admin) logger.info('Admin login');
        res.redirect('/');
    } else {
        res.render('login', {
            google: authorizationUri,
            message: 'invalid-credentials'
        });
    }
}

async function register(req, res) {
    const email = req.body.email;
    const password =
        createHash('sha512')
        .update(req.body.password)
        .update(saltHash)
        .digest('hex');
    if (await User.exists({email})) {
        res.render('register', {message: 'user-already-exists'})
    } else {
        const user = new User({email, password, roles: ['user']});
        await user.save();
        logger.info(`New registration, email: ${email}`);
        res.redirect('/login');
    }
}

function logout(req, res) {
    req.session.destroy(_ => res.redirect('/'));
}

function authorize(...roles) {
    return function(req, res, next) {
        if (req.session.user) {
            if (roles.some(role => req.session.roles.includes(role)));
                return next();
        }
        res.redirect('/login');
    };
}

module.exports = {login, register, logout, authorize};