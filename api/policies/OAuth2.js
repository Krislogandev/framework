import oauth2orize from 'oauth2orize';
import passport from 'passport';
import crypto from 'crypto';
const User = require('./../models/Users');
const AccessToken = require('../models/Tokens');
const RefreshToken = require('../models/Refreshtoken');

// create OAuth 2.0 server
const aserver = oauth2orize.createServer();

// Generic error handler
const errFn = (cb, err) => {
    if (err) {
        return cb(err);
    }
};

// Destroys any old tokens and generates a new access and refresh token
const generateTokens = (data, token, done) => {
    let id = data.userId;
    let updatequery = {
        $set: {
            devicetoken: token
        }
    };
    User.findByIdAndUpdate(id, updatequery).then((user) => {
        // curries in `done` callback so we don't need to pass it
        let errorHandler = errFn.bind(undefined, done),
            refreshToken,
            refreshTokenValue,
            token,
            tokenValue;

        RefreshToken.remove(data, errorHandler).then((ref) => {
            AccessToken.remove(data, errorHandler).then((acc) => {
                tokenValue = crypto.randomBytes(32).toString('hex');
                refreshTokenValue = crypto.randomBytes(32).toString('hex');

                data.token = tokenValue;
                token = new AccessToken(data);

                data.token = refreshTokenValue;

                refreshToken = new RefreshToken(data);
                refreshToken.save(errorHandler).then((reftok) => {
                    token.save().then((result) => {
                        done(null, tokenValue, refreshTokenValue, {
                            expires_in: 3600,
                            user: user,
                            success: true,
                            code: 200,
                        });
                    }).catch((err) => {
                        return done(err);
                    });
                });
            });
        });
    });
};

// Exchange username & password for access token.
aserver.exchange(oauth2orize.exchange.password((client, name, password, token, scope, done) => {
    let username = name.toLowerCase();
    let query = {
        $or: [
            { username: username },
            { email: username },
        ]
    };

    User
        .findOne(query)
        .then((user) => {
            if (!user || !user.checkPassword(password)) {
                return done({ success: false, message: 'Invalid email or password' });
            }
            if (user.isDeactivated) {
                let sms = {
                    body: 'Dear ' + user.firstname + ' your account have been disabled',
                    to: user.mobile
                };
                SharedService.twilio(sms);
                return done({ success: false, message: 'User is Disabled' });
            } else {
                let model = {
                    userId: user.userId,
                    clientId: client.clientId
                };
                let token = scope.token;
                generateTokens(model, token, done);
            }
        })
        .catch((err) => {
            return done(err);
        });

}));

// Exchange refreshToken for access token.
aserver.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, (err, token) => {
        if (err) {
            return done(err);
        }

        if (!token) {
            return done(null, false);
        }

        User.findById(token.userId, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            let model = {
                userId: user.userId,
                clientId: client.clientId
            };

            generateTokens(model, done);
        });
    });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    aserver.token(),
    aserver.errorHandler()
];