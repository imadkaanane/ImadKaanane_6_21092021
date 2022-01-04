const express = require('express');
const router = express.Router();
const max = require("../middleware/limiter")
const verifyPassword = require("../middleware/VerifyPassword")
const userCtrl = require('../controllers/user');

// Creation des routes post
router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', max.limiter ,userCtrl.login);

module.exports = router;