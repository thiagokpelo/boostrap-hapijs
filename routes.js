var routes = [
    {
        method: 'POST'
        , path: '/login'
        , config: {
            validate: {
                payload: {
                    email: Joi.string().email().required()
                    , password: Joi.string().min(2).max(200).required()
                }
            },
            handler: function (request, reply) {
                getValidatedUser(request.payload.email, request.payload.password)
                    .then(function (user) {
                        if (user) {
                            request.auth.session.set(user);
                            return reply('Login Successful!');
                        } else {
                            return reply(Boom.unauthorized('Bad email or password'));
                        }
                    })
                    .catch(function (err) {
                        return reply(Boom.badImplementation());
                    });
            }
        }
    }
    , {
        method: 'GET'
        , path: '/logout'
        , config: {
            handler: function (request, reply) {
                request.auth.session.clear();
                return reply('Logout Successful!');
            }
        }
    }
    , {
        method: 'GET'
        , path: '/example'
        , config: {
            auth: {
                strategy: 'base'
            }
            , handler: function (request, reply) {
                return reply('Success, you can access a secure route!');
            }
        }
    }
    , {
        method: 'GET'
        , path: '/another-example'
        , config: {
            auth: false,
            handler: function (request, reply) {
                return reply('Success, You have accessed a public route!');
            }
        }
    }
]

module.exports = routes;