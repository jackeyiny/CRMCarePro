const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    ip: String, // Địa chỉ IP
    userAgent: String, // Trình duyệt người dùng
    startTime: Date, // Thời gian bắt đầu truy cập
    endTime: Date, // Thời gian kết thúc truy cập
    duration: Number, // Thời gian trong mỗi lượt truy cập (tính bằng giây)
    visits: { type: Number, default: 0 }, // Số lượt truy cập
    totalDuration: { type: Number, default: 0 }, // Tổng thời gian ở lại trang (tính bằng giây)
    averageDuration: { type: Number, default: 0 }, // Thời gian trung bình ở lại trang
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;