const User = require("../models/UserModel")
// dùng để mã hóa mật khẩu
const bcrypt = require("bcrypt")
// dùng để giới hạn thời gian đăng nhập hay mấy cái token kiểu làm về bảo mật
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const jwt = require('jsonwebtoken')
require('dotenv').config();

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, confirmPassword, name } = newUser
        console.log('newUser', newUser)
        try {
            const checkUser = await User.findOne({
                email: email
            })
            // check xem thử nếu == null thì chưa tồn tại trọng database
            // còn nếu khác null thì đã tồn tại rồi
            console.log('checkUser', checkUser)
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The Email is already'
                })
            }
            // mã hóa passwork
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash', hash)

            // viết như này nó sẽ tự động map cái key với cái name với nhau
            const createUser = await User.create({
                email,
                // mình lưu cái password đã mã hóa vào 
                password: hash,
                name,
            })

            console.log('createUser', createUser)
            // nếu tồn tại createUser thì sẽ thực hiện thông báo thành công và trả về data
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    // nhận dữ liệu
                    data: createUser
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

// làm như này nó sẽ tự động thêm lên database cho mình
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;

        try {
            const checkUser = await User.findOne({ email: email });

            console.log('checkUser', checkUser);

            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                });
            }

            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                return resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                });
            }

            // Tạo access token & refresh token
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            // Trả về thông tin user kèm token
            console.log('id', checkUser.id);
            return resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token,
                user: {
                    id: checkUser.id,
                    name: checkUser.name,
                    email: checkUser.email,
                    isAdmin: checkUser.isAdmin
                }
            });

        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createUser,
    loginUser,
}
