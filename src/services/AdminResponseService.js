// services/AdminResponseService.js
const AdminResponse = require('../models/AdminResponseModel');  // Import model AdminResponse
const CustomerRequest = require('../models/CustomerModel');  // Import model CustomerRequest
const User = require('../models/UserModel');  // Import model User (Admin and Customer)

const addAdminResponse = async (customerRequestId, adminId, response, paymentRequested = false) => {
    try {
        // Tìm yêu cầu khách hàng theo ID
        const customerRequest = await CustomerRequest.findById(customerRequestId);
        if (!customerRequest) {
            throw new Error('Customer request not found');
        }

        // Tạo phản hồi của admin
        const newAdminResponse = new AdminResponse({
            customerRequestId,
            adminId,
            response,
            paymentRequested,
        });

        // Lưu phản hồi vào DB
        await newAdminResponse.save();

        // Cập nhật trạng thái chỉ cho yêu cầu có ID tương ứng
        await CustomerRequest.findByIdAndUpdate(customerRequestId, { status: 'Processed' });

        // Nếu có yêu cầu thanh toán, gửi thông báo cho người dùng
        if (paymentRequested) {
            const customer = await User.findById(customerRequest.userId);
            console.log(`Sending payment request notification to customer ${customer.email}`);
        }

        return {
            status: 'OK',
            message: 'Admin response added and request status updated successfully',
            data: newAdminResponse
        };
    } catch (error) {
        throw error;
    }
};

const getAdminResponseByCustomerRequestId = async (customerRequestId) => {
    try {
        // Tìm phản hồi của admin theo customerRequestId
        const adminResponse = await AdminResponse.findOne({ customerRequestId }).populate('adminId', 'name email').populate('comments.userId', 'name');
        
        if (!adminResponse) {
            return {
                status: 'NOT_FOUND',
                message: 'No admin response found for this customer request',
            };
        }

        return {
            status: 'OK',
            message: 'Admin response retrieved successfully',
            data: adminResponse
        };
    } catch (error) {
        throw error;
    }
};

const confirmPayment = async (adminResponseId) => {
    try {
        // Tìm phản hồi của admin theo ID
        const adminResponse = await AdminResponse.findById(adminResponseId);
        if (!adminResponse) {
            throw new Error('Admin response not found');
        }

        // Cập nhật xác nhận thanh toán
        adminResponse.paymentConfirmed = true;
        await adminResponse.save();

        // Trả về thông báo về thanh toán
        const customerRequest = await CustomerRequest.findById(adminResponse.customerRequestId);
        const customer = await User.findById(customerRequest.userId);

        // Giả sử có thể gửi thông báo qua email, SMS hoặc hệ thống thông báo khác
        // Gửi thông báo thanh toán thành công cho người dùng (customer)
        console.log(`Sending payment success notification to customer ${customer.email}`);

        return {
            status: 'OK',
            message: 'Payment confirmed and notification sent to customer',
        };
    } catch (error) {
        throw error;
    }
};
const addComment = async (adminResponseId, userId, message) => {
    try {
        const response = await AdminResponse.findById(adminResponseId);
        if (!response) throw new Error('Admin response not found');

        response.comments.push({ userId, message });
        await response.save();
        return response;
    } catch (error) {
        throw error;
    }
};
const updatePaymentStatus = async (responseId, paymentRequested, paymentConfirmed, responsetoAdmin) => {
    try {
        const updateFields = {};
        if (paymentRequested !== undefined) updateFields.paymentRequested = paymentRequested;
        if (paymentConfirmed !== undefined) updateFields.paymentConfirmed = paymentConfirmed;

        // Cập nhật AdminResponse
        const updatedResponse = await AdminResponse.findByIdAndUpdate(
            responseId,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedResponse) {
            throw new Error('AdminResponse not found');
        }

        // Cập nhật CustomerRequest tương ứng
        const customerUpdateFields = { ...updateFields };
        if (responsetoAdmin !== undefined) customerUpdateFields.responsetoAdmin = responsetoAdmin;

        await CustomerRequest.findByIdAndUpdate(
            updatedResponse.customerRequestId,
            { $set: customerUpdateFields },
            { new: true }
        );

        return updatedResponse;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    addComment,
    addAdminResponse,
    confirmPayment,
    getAdminResponseByCustomerRequestId,
    updatePaymentStatus,
};
