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

// create new server instance
const server = new Hapi.Server();

// add server´s connection information
server.connection({
    host: 'localhost'
    , port: 3000
});

server.state('data', {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

//register plugins to server instance
server.register([Vision, BasicAuth
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
        , path: __dirname + '/views'
        , layout: true
    });
    server.log('info', 'View configuration completed');

    const users = {
        future: {
            username: 'future'
            , password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkUhEZxQCrExQaxzhcdR2xMmpSjiG'
            , name: 'Future Studio'
            , id: '1'
        }
    };

    // let basicValidation = function (request, username, password, callback) {
    //     let user = users[username];

    //     if (!user)
    //         return callback(null, false);

    //     Bcrypt.compare(password, user.password, function (err, isValid) {
    //         server.log('info', 'user authentication successful');
    //         callback(err, isValid, { id: user.id, name: user.name });
    //     });
    // };

    // server.auth.strategy('base', 'basic', { validateFunc: basicValidation });
    server.auth.strategy('base', 'basic', {
        password: 'supersecretpassword', // cookie secret
        cookie: 'app - cookie', // Cookie name
        ttl: 24 * 60 * 60 * 1000 // Set session to 1 day
    });
    server.log('info', 'Registered auth strategy: basic auth');

    const Routes = require('./routes');
    server.route(Routes);
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


// server.register(Inert, (err) => {
//     if (err)
//         throw err;

//     server.route({
//         method: 'GET'
//         , path: '/hello'
//         , handler: function (request, reply) {
//             reply.file('./public/hello.html');
//         }
//     });
// });