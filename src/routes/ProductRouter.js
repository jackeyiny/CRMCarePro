const express = require("express");
const router = express.Router();
const productController = require('../controllers/ProductController');

router.post('/create-product', productController.createProduct);
router.get('/getall', productController.getAllProducts);
router.get('/getone/:id', productController.getOneProduct);
router.put('/update/:id', productController.updateProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.post('/add-review/:productId', productController.addReviewToProduct);

module.exports = router;
