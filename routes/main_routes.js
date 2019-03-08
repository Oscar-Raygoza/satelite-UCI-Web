const express = require('express');
let Controller = require('../controllers/_main.js');

let router = express.Router();

router.route('/').get(Controller.index);

module.exports = router;