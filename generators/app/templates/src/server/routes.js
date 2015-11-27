'use strict';

let router = require('express').Router();
let four0four = require('./utils/404')();

// Route definitions
router.get('/values', getValues);

// Default: 404
router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

// Route implementations

function getValues(req, res, next) {
    var values = ['one', 'two', 'three'];
    res.status(200).send(values);
}
