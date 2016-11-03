'use strict';

var routes = [
    {
        method: 'GET'
        , path: '/'
        , handler: function (request, reply) {
            reply.view('glambox/index');
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
        method: 'GET'
        , path: '/contact'
        , handler: function (request, reply) {
            reply.view('glambox/contact');
        }
    }
];

module.exports = routes;