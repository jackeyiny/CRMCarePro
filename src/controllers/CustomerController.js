// controllers/customerController.js
const CustomerService = require('../services/CustomerService');  // Import CustomerService

const createRequest = async (req, res) => {
    // Lấy thông tin từ body request
    const { userId, message, requestType, productId, rating } = req.body;
    console.log('test1: ', req.body);

    try {
        // Gọi CustomerService để tạo yêu cầu mới
        const newRequest = await CustomerService.createCustomerRequest(userId, message, requestType, productId, rating);

        // Trả về phản hồi thành công
        res.status(201).json({
            message: 'Customer request created successfully',
            request: newRequest
        });
    } catch (error) {
        // Xử lý lỗi
        res.status(400).json({
            message: error.message || 'Error creating customer request'
        });
    }
}
const getAllRequests = async (req, res) => {
    try {
        const allRequests = await CustomerService.getAllRequests();
        res.status(200).json(allRequests);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error fetching customer requests' });
    }
};
const updateNotify = async (req, res) => {
    try {
        console.log('hi',req.params,req.body);
        const { requestId } = req.params;
        const { notify } = req.body; // Lấy trạng thái notify từ request body

        if (typeof notify !== "boolean") {
            return res.status(400).json({ message: "Giá trị notify phải là boolean (true hoặc false)" });
        }

        const updatedRequest = await CustomerService.updateNotifyStatus(requestId, notify);

        if (!updatedRequest) {
            return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
        }

        return res.status(200).json({ message: "Cập nhật notify thành công", data: updatedRequest });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
module.exports = {
    createRequest,
    getAllRequests,
    updateNotify
};
