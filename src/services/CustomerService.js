const Customer = require('../models/CustomerModel');  // Import model CustomerRequest
const User = require('../models/UserModel');  // Import model User
const Product = require('../models/ProductModel');  // Import model Product

const createCustomerRequest = async (userId, message, requestType, productId = null, rating = null, adminResponse = null) => {
    try {
        console.log(userId, message, requestType, productId, rating, adminResponse);

        // Kiểm tra người dùng có tồn tại không
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (requestType === 'Feedback') {
            // Kiểm tra nếu requestType là 'Feedback', sẽ thêm đánh giá vào sản phẩm
            if (!productId || !rating) {
                throw new Error('Product ID and rating are required for feedback');
            }

            // Chuyển productId thành ObjectId nếu cần thiết
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Thêm đánh giá vào mảng reviews của sản phẩm
            product.reviews.push({
                user: userId,
                rating: rating,
                comment: message,  // Thông điệp là phần mô tả của đánh giá
            });

            // Lưu lại sản phẩm với đánh giá mới
            await product.save();

            return {
                status: 'OK',
                message: 'Feedback added successfully to product',
                data: product
            };
        } else if (requestType === 'Quote Request') {
            // Nếu là yêu cầu báo giá, lưu yêu cầu và thông tin sản phẩm
            if (!productId) {
                throw new Error('Product ID is required for Quote Request');
            }

            // Kiểm tra sản phẩm có tồn tại không
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            // Tạo yêu cầu báo giá
            const newRequest = new Customer({
                userId,
                message,
                requestType,
                productId,
                status: 'Unprocessed'
            });

            // Lưu yêu cầu vào DB
            await newRequest.save();

            return {
                status: 'OK',
                message: 'Quote request created successfully',
                data: newRequest
            };
        } else if (requestType === 'Complaint') {
            // Nếu là khiếu nại, lưu yêu cầu và phản hồi từ admin
            if (!adminResponse) {
                throw new Error('Admin response is required for Complaints');
            }

            // Tạo yêu cầu khiếu nại
            const newRequest = new Customer({
                userId,
                message,
                requestType,
                adminResponse, // Lưu phản hồi của admin
                status: 'Processed'
            });

            // Lưu yêu cầu vào DB
            await newRequest.save();

            return {
                status: 'OK',
                message: 'Complaint created successfully',
                data: newRequest
            };
        } else {
            throw new Error('Invalid request type');
        }
    } catch (error) {
        throw error;  // Ném lỗi lên Controller xử lý
    }
};
const getAllRequests = async () => {
    try {
        const requests = await Customer.find()
            .populate('userId', 'name email') // Lấy thông tin user (chỉ lấy name và email)
            .populate('productId', 'name image description') // Lấy thông tin sản phẩm (chỉ lấy name, image, description)
            .populate({
                path: 'adminResponse',
                select: 'response paymentRequested paymentConfirmed adminId',
                populate: { path: 'adminId', select: 'name email' } // Lấy thông tin admin đã phản hồi
            })
            .lean(); // Chuyển dữ liệu về JSON thuần

        return {
            status: 'OK',
            message: 'Fetched all customer requests successfully',
            data: requests
        };
    } catch (error) {
        throw error;
    }
};
const updateNotifyStatus = async (requestId, notifyStatus) => {
    try {
        

        const updateFields = {};
        if (notifyStatus !== undefined) updateFields.notify = notifyStatus;

        // Cập nhật CustomerRequest
        const updatedRequest = await Customer.findByIdAndUpdate(
            requestId,
            { $set: updateFields },
            { new: true }
        );
        console.log(updatedRequest);
        if (!updatedRequest) {
            throw new Error(" Không tìm thấy CustomerRequest");
        }

        return updatedRequest;
    } catch (error) {
        console.error("Lỗi khi cập nhật notify:", error.message);
        throw new Error(error.message);
    }
};

module.exports = {
    createCustomerRequest,
    getAllRequests,
    updateNotifyStatus
};
