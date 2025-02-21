const express = require("express");
const router = express.Router()
const customerController = require('../controllers/CustomerController');
router.post('/request', customerController.createRequest) 
router.get('/getall', customerController.getAllRequests)
router.post("/:requestId/notify", customerController.updateNotify);
module.exports = router

