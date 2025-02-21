const express = require("express");
const router = express.Router()
const adminresponseController = require('../controllers/AdminController');
// Route để admin phản hồi yêu cầu của khách hàng (bao gồm yêu cầu báo giá và khiếu nại)
router.post('/addResponse', adminresponseController.addAdminResponse);

// Route để admin xác nhận thanh toán khi người dùng đã yêu cầu thanh toán
router.post('/confirmPayment/:adminResponseId', adminresponseController.confirmPayment);
router.get('/admin-response/:customerRequestId', adminresponseController.getAdminResponseByCustomerRequestId);
router.post('/admin-responses/comment', adminresponseController.addComment);
router.post('/admin-responses/update', adminresponseController.updatePaymentStatusController);

module.exports = router

