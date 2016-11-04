'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Handlebars = require('handlebars');
const Request = require('request');
const rp = require('request-promise');
const CookieAuth = require('hapi-auth-cookie')

const URL = "https://api.glambox.com.br/"

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.register([Vision, Inert], (err) => {
    if (err)
        throw err;
    server.log('info', 'Plugins registered');
});

server.views({
    engines: {
        html: Handlebars
    }
    , path: __dirname + '/public/views'
    , layoutPath: __dirname + '/public/views/layout'
    , layout: 'default'
});



server.route([
    {
        method: 'GET'
        , path: '/contact'
        , handler: function (request, reply) {
            reply.view('glambox/about');
        }
    }
    , {
        method: 'GET'
        , path: '/about'
        , handler: function (request, reply) {
            reply.view('glambox/about');
        }
    }
    , {
        method: ['GET', 'POST']
        , path: '/'
        , config: {
            handler: function (request, reply) {

                var message;

                console.log(request.payload);

                if (request.method === 'post') {

                    if (!request.payload.email || !request.payload.password) {
                        console.log('payload vazio');
                        message = 'Missing username or password';
                    }
                    else {
                        rp({
                            method: 'POST',
                            uri: URL + "open-LogIn",
                            form: {
                                email: request.payload.email,
                                password: request.payload.password
                            },
                            headers: {
                                'content-type': 'application/x-www-form-urlencoded'
                            }
                        })
                            .then(function (body) {

                                console.log("Result: ", body);
                                let data = JSON.parse(body);

                                if (data.resultType == 'SUCCESS') {
                                    return reply.redirect('/about');
                                }

                                if (data.resultType == 'FAILED' || data.resultType == 'EXCEPTION' || data.resultType == 'VALIDATION_FAILED') {
                                    message = data.message;
                                }

                                reply.view('glamgirl/login', {
                                    message: message
                                });
                            })
                            .catch(function (err) {
                                console.log("Error: ", err);
                            });
                    }
                }

                if (request.method === 'get') {
                    reply.view('glamgirl/login', {
                        message: "Get"
                    });
                }




            }
        }
    }
]);


server.start(() => {
    console.log('Server ready');
});