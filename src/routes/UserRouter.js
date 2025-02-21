const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController');
const { AuthMiddleware, AuthUserMiddleware } = require("../middleware/AuthMiddleware");

router.post('/sign-in', userController.loginUser)

router.post('/sign-up', userController.createUser)

module.exports = router

