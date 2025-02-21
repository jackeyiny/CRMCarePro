const userService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        // hiển thị ra những dữ liệu nhận về bên phía client
        // console.log(req.body)

        // nhận những dữ liệu dx gửi qua từ phía client
        const { email, password, confirmPassword } = req.body
        console.log('req.body', req.body)

        // kiểm tra mk và nhập lại mk có giống ko nếu ko trả về lỗi
        if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật Khẩu Không Trùng Khớp'
            })
        } 

        const response = await userService.createUser(req.body)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            err: e
        })
    }
}

const loginUser = async (req, res) => {
    try {
        // hiển thị ra những dữ liệu nhận về bên phía client
        console.log('thong tin dang nhap',req.body)

        // nhận những dữ liệu dx gửi qua từ phía client
        const {email, password} = req.body

        // kiểm tra xem có phải là email ko hay là 1 cái String
        const reg = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const isCheckEmail = reg.test(email)
        
        if(!email || !password) {
            // trả về 1 thông báo lỗi khi ko nhận dx 1 cái nào đó
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            // trả về 1 thông báo lỗi ở email
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        
        // nhận dữ liệu từ UserRouter.js sau đó sẽ truyền dữ liệu nhận đx vào UserService để xử lý
        const response = await userService.loginUser(req.body)

        const { refresh_token, ...newReponse } = response
        // console.log("response", response)

        // giờ cái --refresh_token-- ta sẽ dùng cho cái --cookie--
        res.cookie('refresh_token', refresh_token, {
            // giúp mình chỉ lấy được cái --cookie-- này thông qua --http-- thôi
            // ko lấy đx bằng --javascrip--
            HttpOnly: true,
            // đảm nhiệm việc bảo mật ở phía client
            secure: false,
            samesite: 'strict',
            path: '/',

        })
        //  thêm refresh_token để trả về refresh_token cho phía client nhận dx
        return res.status(200).json({...newReponse, refresh_token})
        
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            err: e
        })
    }
}


module.exports = {
    createUser,
    loginUser,
}