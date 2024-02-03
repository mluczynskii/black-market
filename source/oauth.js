const fetch = require('node-fetch');
const {AuthorizationCode} = require('simple-oauth2');
const {logger} = require('./logs');

const {OAUTH_CLIENT, OAUTH_SECRET} = process.env;

const oauth2 = new AuthorizationCode({
    client: {
        id: OAUTH_CLIENT,
        secret: OAUTH_SECRET
    },
    auth: {
        tokenHost: 'https://www.googleapis.com',
        tokenPath: '/oauth2/v4/token',
        authorizeHost: 'https://accounts.google.com',
        authorizePath: '/o/oauth2/v2/auth'
    }
});

const authorizationUri = oauth2.authorizeURL({
    redirect_uri: 'http://localhost:3000/oauth',
    scope: 'openid profile email'
});

async function oauth(req, res) {
    const code = req.query.code;
    const options = {
        code: code,
        redirect_uri: 'http://localhost:3000/oauth'
    }

    let result = await oauth2.getToken(options);
    let access_token = result.token.access_token;

    let response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
            "Authorization": `Bearer ${encodeURIComponent(access_token)}`
        }
    });
    let profile = await response.json();
    if (profile.email) {
        req.session.user = profile.email;
        req.session.roles = ['user'];
        req.session.cart = {
            total: 0,
            order: {}
        };
        logger.info(`Successful OAuth login, email: ${profile.email}`);
        res.redirect('/');
    }
}

module.exports = {oauth, authorizationUri};