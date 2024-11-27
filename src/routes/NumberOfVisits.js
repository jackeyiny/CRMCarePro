const express = require("express");
const router = express.Router()
const NumberOfVisitsController = require('../controllers/NumberOfVisitsController');

router.post('/create-NumberOfVisits', NumberOfVisitsController.createNumberOfVisits)
router.get('/get-NumberOfVisits', NumberOfVisitsController.getNumberOfVisits)

module.exports = router