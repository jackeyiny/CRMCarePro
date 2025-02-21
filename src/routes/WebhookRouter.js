const express = require('express');
const router = express.Router();

// Route xử lý webhook
router.post('/', (req, res) => {
    console.log("📩 Received Webhook Data:", req.body); // Log dữ liệu webhook nhận được

    // Xử lý dữ liệu webhook (tùy theo yêu cầu)
    res.status(200).json({ message: "Webhook received successfully" });
});

module.exports = router;
