const express = require("express");
const router = express.Router()
const orderController = require('../controllers/orderController');
const { AuthUserMiddleware, AuthMiddleware } = require("../middleware/AuthMiddleware");


router.post('/create', AuthUserMiddleware, orderController.createOrder)

// lấy sản phẩm đã order theo id 
router.get('/get-all-order/:id', AuthUserMiddleware, orderController.getAllOrderDetail)

router.get('/get-details-order/:id', AuthUserMiddleware, orderController.getDetailsOrder)

router.delete('/cancel-order/:id', AuthUserMiddleware, orderController.cancelOrderDetails)

router.get('/get-all-order', AuthUserMiddleware, orderController.getAllOrder)

router.put('/update-order/:id', orderController.UpdateOrder)

module.exports = router