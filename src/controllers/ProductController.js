const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
    try {
        const response = await ProductService.createProduct(req.body);
        return res.status(201).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const response = await ProductService.getAllProducts();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
};

const getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await ProductService.getProductById(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await ProductService.updateProduct(id, req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await ProductService.deleteProduct(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
};

const addReviewToProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId, rating, comment } = req.body;
        const response = await ProductService.addReviewToProduct(productId, userId, rating, comment);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: "ERR",
            message: e.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
    addReviewToProduct
};
