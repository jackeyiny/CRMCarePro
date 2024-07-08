const User = require("../models/UserModel")
// dùng để mã hóa mật khẩu
// const bcrypt = require("bcrypt")
// dùng để giới hạn thời gian đăng nhập hay mấy cái token kiểu làm về bảo mật
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const { sendOtpEmail } = require("./PasswordRetrievalUser")

// làm như này nó sẽ tự động thêm lên database cho mình
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {email, password, confirmPassword} = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            // check xem thử nếu == null thì chưa tồn tại trọng database
            // còn nếu khác null thì đã tồn tại rồi
                /* 
                resolve({
                    data: checkUser
                })
                */
            if(checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The Email is already'
                })
            }
            // mã hóa passwork
            // const hash = bcrypt.hashSync(password, 10)
            // console.log('hash', hash)    

            // viết như này nó sẽ tự động map cái key với cái name với nhau
            const createUser = await User.create({
                email,
                // mình lưu cái password đã mã hóa vào 
                password: password, 
                // password: hash, 

                // này ko cẩn thiệt lưu
                // confirmPassword: hash, 
            })
            // nếu tồn tại createUser thì sẽ thực hiện thông báo thành công và trả về data
            if(createUser) {
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
        const {email, password} = userLogin
        // console.log('password', password)

        try {
            const checkUser = await User.findOne({
                email: email
            })
            // check xem thử nếu === null thì chưa tồn tại trọng database
            // còn nếu khác null thì đã tồn tại rồi
                /* 
                resolve({
                    data: checkUser
                })
                */
            if(checkUser === null) {
                resolve({
                    status: 'ERR',
                    // thông báo tài khoảng chưa tồn tại
                    message: 'The user is not defined'
                })
            }
            // const comparePassword = bcrypt.compareSync(password, checkUser.password)

            // if (!comparePassword) {
            //     resolve({
            //         status: 'ERR',
            //         message: 'The password or user is incorrect'
            //     })
            // }
            
            // ta sẽ cung cấp --access_token-- khi --login-- vào trang web
            // cài này dùng để giới giạn thời gian đang nhập là --1H-- 
            const access_token = await genneralAccessToken({
                // ta sẽ chuyền --id, isAdmin-- dưới database lên thông qua --checkUser.id, checkUser.isAdmin--
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            // console.log('access_token', access_token)

            // cái này giới hạn tài khoảng có thời hạn là --365d--
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            // console.log('refresh_token ban dau', refresh_token)

            // còn mật khẩu đúng thì trả về
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                // nhận dữ liệu
                access_token,
                refresh_token
            })
            
        } catch (e) {
            reject(e)
        }
    })
}

// này để update sản phẩm
const updateUser = (id, data) => {
    // console.log('111', data.phone);
    // variable = data.phone
    // if (typeof variable === 'number' && Number.isInteger(variable)) {
    //     console.log("Biến là một số nguyên.");
    // } else {
    //     console.log("Biến không phải là số nguyên.");
    // }
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const checkUser = await User.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (checkUser === null) {
                resolve({
                    status: 'ok',
                    message: 'The user is not defined 2'
                })
            }

            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

// delete User
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const checkUser = await User.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (checkUser === null) {
                resolve({
                    status: 'ok',
                    message: 'The user is not defined 3'
                })
            }

            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

// delete many User
const deleteUserMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete many user success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in thông tin toàn bộ user user ra
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in ra thông tin user theo id
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const user = await User.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (user === null) {
                resolve({
                    status: 'ok',
                    message: 'The user is not defined 4'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get Success',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in ra thông tin user theo id
const checkDetailsUserByEmail = (emailUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            // chuyển cái email gửi từ client lên với kiểu string
            // sau đó chuyển sang email
            const emailUser1 = emailUser.email; 

            // check xem 2 id có giống nhau ko
            const user = await User.findOne({
                email: emailUser1
            })
            
            // nếu ko gióng thì in ra thông báo
            if (!user) {
                console.log('user')
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            } 
            
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 5 * 30 * 1000); // OTP hết hạn sau 30 giây
    
            // lưu otp cũng như thời gian hết hạn
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
    
            // gọi tới gửi mã otp đến email
            await sendOtpEmail(emailUser1, otp);
    
            resolve({
                status: 'OK',
                message: 'OTP sent successfully',
                data: user
            });
            
        } catch (e) {
            reject(e)
        }
    })
}
const checkDetailsUserByOTP = (otpAndPassword) => {
    return new Promise(async (resolve, reject) => {
        const { otp, email } = otpAndPassword;
        try {
            // const emailUser = email.email; 
            const user = await User.findOne({ email: email });

            // Check if the user exists
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
                return;
            }

            // Check if OTP matches and OTP is not expired
            if (user.otp !== otp || user.otpExpiry < Date.now()) {
                resolve({
                    status: 'ERR',
                    message: 'Expired or invalid OTP'
                });
                return;
            }

            // If OTP is valid and not expired, resolve with user data
            resolve({
                status: 'OK',
                message: 'Successfully verified OTP',
                data: user
            });

        } catch (e) {
            reject(e);
        }
    });
};
const ChangePassword = (newChangePassword) => {
    return new Promise(async (resolve, reject) => {
        const { otp, email, anewpassword } = newChangePassword;
        try {
            // const emailUser = email.email; 
            const user = await User.findOne({ email: email });

            // Check if the user exists
            if (!user) {
                resolve({
                    status: 'ERR',
                    message: 'User not found'
                });
                return;
            }

            console.log('otp', otp, user.otpExpiry)
            // Check if OTP matches and OTP is not expired
            if (user.otp !== otp || user.otpExpiry < Date.now()) {
                resolve({
                    status: 'ERR',
                    message: 'Expired or invalid OTP'
                });
                return;
            }

            // const hashedPassword = await bcrypt.hash(anewpassword, 10);
            user.password = anewpassword;
            user.otp = null;
            user.otpExpiry = null;
            await user.save();

            
            // If OTP is valid and not expired, resolve with user data
            resolve({
                status: 'OK',
                message: 'Password changed successfully',
                data: updateUser
            });

        } catch (e) {
            reject(e);
        }
    });
};



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteUserMany,
    checkDetailsUserByEmail,
    checkDetailsUserByOTP,
    ChangePassword
}