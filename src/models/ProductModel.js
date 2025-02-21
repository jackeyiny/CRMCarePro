const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // tham chiếu tới bảng người dùng
        rating: { type: Number, required: true, min: 1, max: 5 },  // điểm đánh giá từ 1 đến 5
        comment: { type: String, required: true },  // nội dung đánh giá
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String },
        reviews: [reviewSchema],  // mảng lưu các đánh giá
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
