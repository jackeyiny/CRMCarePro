const commentService = require('../services/CommentService')

// nơi nhận dữ liệu từ client thông qua --req-- rồi đóng gói lại dữ liệu lại rồi chuyển đến --service-- xử lý
// nới chuyển dữ liệu từ server qua client thông qua --res--

// create Comment
const createComment = async (req, res) => {
    try {
        // hiển thị ra những dữ liệu nhận về bên phía client
        // console.log('nhận dữ liệu comment', req.body)

        // nhận những dữ liệu dx gửi qua từ phía client
        const { name, id_user, id_product, user_comments, image_comments  } = req.body

        
        // kiểm tra xem nếu mà nó ko có 1 trong những thằng này
        if(!name || !id_user || !id_product || !user_comments || !image_comments) {
            // trả về 1 thông báo lỗi khi ko nhận dx 1 cái nào đó
            return res.status(200).json({
                status: 'ERR',
                message: 'Bạn phải cập nhật thông tin Name và Image mới được Comment'
            })
        } 
        
        // nhận dữ liệu từ commentRouter.js sau đó sẽ truyền dữ liệu nhận đx vào commentService để xử lý
        const response = await commentService.createComment(req.body)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            err: e
        })
    }
}

// update Comment
const updateComment = async (req, res) => {
    try {
        // nhận id từ url
        const commentId = req.params.id
        // dữ liệu gửi lên từ server
        const data = req.body
        // console.log('data', data)

        // kiểm tra nếu ko lấy dx id
        if(!commentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The commentId id is required'
            })
        }
        // in ra để kiểm tra
        // console.log('commentId', commentId)

        // đóng gói dữ liệu cần update và id lấy từ url gửi qua service
        const response = await commentService.updateComment(commentId, data)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// delete Comment
const deleteComment = async (req, res) => {
    try {
        // nhận id từ url
        const commentId = req.params.id
        // console.log('userId: ', userId)

        // kiểm tra nếu ko lấy dx id
        if(!commentId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The commentId id is required'
            })
        }

        // gửi id lấy từ url sang cho service xử lý tiến hành xóa
        const response = await commentService.deleteComment(commentId)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// lấy toàn bộ thông tin Comment
const getAllComment = async (req, res) => {
  try {
      // Nhận id_product từ req.body
      const { id_product } = req.body;

      // Gọi service với id_product
      const response = await commentService.getAllComment(id_product);

      // Trả về kết quả dưới dạng JSON
      return res.status(200).json(response);
  } catch (e) {
      // Báo lỗi nếu có lỗi xảy ra
      return res.status(404).json({
          message: e.message // Sử dụng e.message thay vì e để trả về thông điệp lỗi chi tiết
      });
  }
}
const getAllCommentApp = async (req, res) => {
    try {
        // Nhận id_product từ req.body
        const { id } = req.params;
        // console.log('idsdf', id)
  
        // Gọi service với id_product
        const response = await commentService.getAllComment(id);
  
        // Trả về kết quả dưới dạng JSON
        return res.status(200).json(response);
    } catch (e) {
        // Báo lỗi nếu có lỗi xảy ra
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e để trả về thông điệp lỗi chi tiết
        });
    }
  }





module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getAllComment,
    getAllCommentApp
}