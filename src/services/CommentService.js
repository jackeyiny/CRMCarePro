const Comment = require("../models/CommentModel");

// create Comment
const createComment = (newComment) => {
    return new Promise(async (resolve, reject) => {
        const { name, id_user, id_product, user_comments, image_comments } = newComment;
        // console.log('newComment', newComment)
        try {
            // Tạo một bình luận mới trong cơ sở dữ liệu
            const createdComment = await Comment.create({
                name,
                id_user,
                id_product,
                user_comments,
                image_comments,
            });
            // console.log('createdComment', createdComment)

            if (createdComment) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdComment
                });
            } else {
                resolve({
                    status: 'error',
                    message: 'Failed to create comment'
                });
            }
            
        } catch (e) {
            reject(e);
        }
    });
};

// update Comment
const updateComment = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem bình luận có tồn tại không
            const existingComment = await Comment.findById(id);

            if (!existingComment) {
                resolve({
                    status: 'error',
                    message: 'The comment does not exist'
                });
            }

            const updatedComment = await Comment.findByIdAndUpdate(id, data);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedComment
            });
        } catch (e) {
            reject(e);
        }
    });
};

// delete Comment
const deleteComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem bình luận có tồn tại không
            const existingComment = await Comment.findById(id);

            if (!existingComment) {
                resolve({
                    status: 'error',
                    message: 'The comment does not exist'
                });
            }

            await Comment.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'Delete comment success'
            });
        } catch (e) {
            reject(e);
        }
    });
};

// getAll Comment
const getAllComment = (id_product) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allComments = await Comment.find({ id_product: id_product });
            resolve({
                status: 'OK',
                message: 'Success',
                data: allComments
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllCommentApp = (id_product) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allComments = await Comment.find({ id_product: id_product });
            resolve({
                status: 'OK',
                message: 'Success',
                data: allComments
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getAllComment,
    getAllCommentApp
};

