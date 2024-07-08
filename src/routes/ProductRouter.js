const express = require("express");
const router = express.Router()
const productController = require('../controllers/ProductController');
const { AuthMiddleware } = require("../middleware/AuthMiddleware");

// sau khi nhận được dữ liệu từ index.js thì sẽ chuyển đến controler
// bên --client-- gọi đến các phương thức --get, post, put, delete--
router.post('/create', productController.createProduct)
router.put('/update/:id', AuthMiddleware, productController.updateProduct)
router.get('/details/:id', productController.getDetailsProduct)
router.get('/getAll', productController.getAllProduct)
router.delete('/delete/:id', AuthMiddleware, productController.deleteProduct)

// tại vì ta nhận --ids-- thông qua --rea.body-- nên sẽ dùng --post-- để nhận
// còn khi nào nhận --id-- thông qua --url-- thì mói dùng --delete--
router.post('/delete-many', AuthMiddleware, productController.deleteProductMany)

// lấy type của sản phẩm ra
router.get('/get-all-type', productController.getAllTypeProduct)

module.exports = router