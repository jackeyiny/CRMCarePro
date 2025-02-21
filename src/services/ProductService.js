const Product = require("../models/ProductModel");
const { uploadImage } = require('../untils/uploadImage');

// ✅ Thêm sản phẩm
const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, description } = newProduct;
        try {
            // Tạo sản phẩm mới với mảng reviews rỗng
            const createdProduct = await Product.create({
                name,
                image,
                description,
                reviews: []  // Mảng reviews mặc định là rỗng
            });

            resolve({
                status: "OK",
                message: "Product created successfully",
                data: createdProduct
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ✅ Lấy danh sách tất cả sản phẩm
const getAllProducts = () => {
    
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.find()
                .populate('reviews.user', 'name');  // Nếu muốn lấy thông tin người dùng từ các đánh giá
            resolve({
                status: "OK",
                message: "Fetched all products successfully",
                data: products
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ✅ Sửa sản phẩm
const updateProduct = (id, updatedData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updatedProduct) {
                return resolve({
                    status: "ERR",
                    message: "Product not found"
                });
            }

            resolve({
                status: "OK",
                message: "Product updated successfully",
                data: updatedProduct
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ✅ Xóa sản phẩm
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);

            if (!deletedProduct) {
                return resolve({
                    status: "ERR",
                    message: "Product not found"
                });
            }

            resolve({
                status: "OK",
                message: "Product deleted successfully"
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ✅ Thêm đánh giá cho sản phẩm
const addReviewToProduct = (productId, userId, rating, comment) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "Product not found"
                });
            }

            // Thêm đánh giá vào mảng reviews
            product.reviews.push({
                user: userId,
                rating: rating,
                comment: comment,
            });

            await product.save();  // Lưu sản phẩm với đánh giá mới

            resolve({
                status: "OK",
                message: "Review added successfully",
                data: product
            });

        } catch (e) {
            reject(e);
        }
    });
};

// ✅ Lấy thông tin sản phẩm theo ID
const getProductById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(id).populate('reviews.user');

            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "Product not found"
                });
            }

            resolve({
                status: "OK",
                message: "Product fetched successfully",
                data: product
            });

        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addReviewToProduct,
    getProductById
};
