'use strict';

var routes = [
    {
        method: 'GET'
        , path: '/login'
        , config: {
            handler: function (request, reply) {
                var email = request.payload.email
                var password = request.payload.password
                
                request.cookieAuth.set(user);

                reply.view('glamgirl/login')
            }
        }
    }
    , {
        method: 'GET'
        , path: '/glamgirl'
        , config: {
            auth: 'session'
            , handler: function (request, reply) {
                reply.view('glamgirl/index');
            }
        }
    }
    , {
        method: 'GET'
        , path: '/glamgirl/minhas-assinaturas'
        , config: {
            auth: 'session'
            , handler: function (request, reply) {
                reply.view('glamgirl/minhas-assinaturas');
            }
        }
    }
    , {
        method: 'GET'
        , path: '/glamgirl/glampoints'
        , config: {
            auth: 'session'
            , handler: function (request, reply) {
                reply.view('glamgirl/glampoints');
            }
        }
    }
];

module.exports = routes;