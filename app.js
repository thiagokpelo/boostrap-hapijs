'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Boom = require('boom');
const Joi = require('joi');
const Good = require('good');
const Bcrypt = require('bcrypt');
const Vision = require('vision');
const BasicAuth = require('hapi-auth-basic');
const Handlebars = require('handlebars');
const CookieAuth = require('hapi-auth-cookie')

const options = {
    password: 'password-should-be-32-characters',
    cookie: 'sid-example',
    redirectTo: '/glamgirl',
    isSecure: false,
    validateFunc: function(request, session, callback) {

        cache.get(session.sid, (err, cached) => {

            if (err) {
                return callback(err, false);
            }

            if (!cached) {
                return callback(null, false);
            }

            return callback(null, true, cached.account);
        });
    }
}

// create new server instance
const server = new Hapi.Server();

// add server´s connection information
server.connection({
    host: 'localhost'
    , port: 3000
    , router: {
        isCaseSensitive: false,
        stripTrailingSlash: true
    }
});

//register plugins to server instance
server.register([Vision, BasicAuth, Inert, CookieAuth
    , {
        register: Good
        , options: {
            ops: { interval: 10000 }
            , reporters: {
                console: [{
                    module: 'good-squeeze'
                    , name: 'Squeeze'
                    , args: [{ log: '*', response: '*' }]
                }
                    , {
                    module: 'good-console'
                }
                    , 'stdout'
                ]
            }
        }
    }
], (err) => {
    if (err)
        throw err;
    server.log('info', 'Plugins registered');

    server.views({
        engines: {
            html: Handlebars
        }
        , path: __dirname + '/public/views'
        , layoutPath: __dirname + '/public/views/layout'
        , layout: 'default'
    });
    server.log('info', 'View configuration completed');

    server.auth.strategy('session', 'cookie', true, options)
    server.log('info', 'Cookie registered');

    server.route(require('./config/routes/_general.js'));
    server.log('info', 'Routes registered');

    server.start((err) => {
        if (err) {
            server.log('error', 'Failed to start server');
            server.log('error', err);
            throw err;
        }

        server.log('info', 'Server running at: ' + server.info.uri);
    });
});