const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    conversationId: { type: String, required: true }, // Mã định danh cuộc trò chuyện giữa user và admin
    senderId: { type: String, required: true },       // ID người gửi (user hoặc admin)
    senderName: { type: String, required: true },     // Tên người gửi
    senderImage: { type: String },                    // Ảnh người gửi
    messageContent: { type: String, required: true }, // Nội dung tin nhắn
    status: { type: String, enum: ['read', 'unread'], default: 'unread' }, // Trạng thái đã đọc/chưa đọc
    isAdmin: { type: Boolean, default: false, required: true },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;

