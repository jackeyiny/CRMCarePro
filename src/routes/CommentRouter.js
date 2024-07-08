const express = require("express");
const router = express.Router()
const commentController = require('../controllers/CommentController');


router.post('/create-comment', commentController.createComment)

router.put('/update-comment/:id', commentController.updateComment)

router.delete('/delete-conmment/:id', commentController.deleteComment)

router.post('/getAllComment', commentController.getAllComment)


module.exports = router