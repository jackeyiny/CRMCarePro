const express = require("express");
const router = express.Router()
const sliderController = require('../controllers/SliderController');
const { AuthMiddleware } = require("../middleware/AuthMiddleware");

router.post('/create', sliderController.createSlider)
router.get('/getAll', sliderController.getAllSlider)
router.put('/update/:id', AuthMiddleware, sliderController.updateSlider)
router.delete('/delete/:id', AuthMiddleware, sliderController.deleteSlider)
router.post('/delete-many', AuthMiddleware, sliderController.deleteSliderMany)
router.get('/details/:id', sliderController.getDetailsSlider)

module.exports = router

