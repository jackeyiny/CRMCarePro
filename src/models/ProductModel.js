const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        // tên
        name: { type: String, required: true},
        // ảnh
        image: { type: String, required: true },
        // Loại hàng 
        type: { type: String, required: true },
        // giá
        price: { type: Number, required: true },
        // số lượng sản phẩm
        countInStock: { type: Number, required: true },
        // sao đánh giá
        rating: { type: Number, required: true },
        // mô tả
        description: { type: String },
        // giảm giá
        discount: { type: Number },
        // số lượng bán
        selled: { type: Number },
        
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;