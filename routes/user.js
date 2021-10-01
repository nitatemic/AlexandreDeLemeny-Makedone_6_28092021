const userCtrl = require('../controllers/User.js')
const express = require('express')
const authMiddleware = require('../middlewares/auth.js')

const router = express.Router();
router.post("/signup", authMiddleware.checkMail, userCtrl.createUser);

module.exports = router
