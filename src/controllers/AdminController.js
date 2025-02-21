// controllers/AdminResponseController.js
const AdminResponseService = require('../services/AdminResponseService');  // Import AdminResponseService

// Controller để thêm phản hồi của admin cho yêu cầu khách hàng (bao gồm báo giá và khiếu nại)
const addAdminResponse = async (req, res) => {
    const { customerRequestId, adminId, response, paymentRequested } = req.body;

    try {
        const result = await AdminResponseService.addAdminResponse(customerRequestId, adminId, response, paymentRequested);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error adding admin response'
        });
    }
};

// Controller để admin xác nhận thanh toán
const confirmPayment = async (req, res) => {
    const { adminResponseId } = req.params;

    try {
        const result = await AdminResponseService.confirmPayment(adminResponseId);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message || 'Error confirming payment'
        });
    }
};
const getAdminResponseByCustomerRequestId = async (req, res) => {
    try {
        const { customerRequestId } = req.params;

        const result = await AdminResponseService.getAdminResponseByCustomerRequestId(customerRequestId);

        if (result.status === 'NOT_FOUND') {
            return res.status(404).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching admin response:', error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Internal server error',
        });
    }
};
const addComment = async (req, res) => {
    try {
        const { userId, adminResponseId, message } = req.body;
        console.log('body: ', req.body);
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const updatedResponse = await AdminResponseService.addComment(adminResponseId, userId, message);
        res.status(200).json(updatedResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updatePaymentStatusController = async (req, res) => {
    try {
        console.log('kq=', req.body);
        const { responseId, paymentRequested, paymentConfirmed,responsetoAdmin } = req.body;
        const updatedResponse = await AdminResponseService.updatePaymentStatus(responseId, paymentRequested, paymentConfirmed,responsetoAdmin);
        res.status(200).json(updatedResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
module.exports = {
    addAdminResponse,
    confirmPayment,
    getAdminResponseByCustomerRequestId,
    addComment,
    updatePaymentStatusController
};
