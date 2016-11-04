'use strict';

const Request = require('request');
const rp = require('request-promise');

rp(options)
    .then(function (body) {
        console.log("Success: ", body);
    })
    .catch(function (err) {
        console.log("Error: ", err);
    });