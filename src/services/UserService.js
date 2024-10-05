const User = require("../models/UserModel")
// dùng để mã hóa mật khẩu
// const bcrypt = require("bcrypt")
// dùng để giới hạn thời gian đăng nhập hay mấy cái token kiểu làm về bảo mật
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const { sendOtpEmail, sendOtpEmailLogIn } = require("./PasswordRetrievalUser")
const jwt = require('jsonwebtoken')
require('dotenv').config();
const secret = '123123'

// làm như này nó sẽ tự động thêm lên database cho mình
const checkEmailSignUp = (emailUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { email, name, OK } = emailUser;

            // Kiểm tra xem email đã tồn tại hay chưa
            const user = await User.findOne({ email: email });

            if(email && name && !OK) {
                if (user !== null) {
                    resolve({
                        status: 'OK',
                        message: 'Email already exists'
                    });
                    return;
                }
            } else if(email && name && OK) {
                if (user !== null) {
                    resolve({
                        status: 'ERR',
                        message: 'Email already exists'
                    });
                    return;
                }
            }
            

            // Tạo mã OTP ngẫu nhiên
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            // Tạo JWT chứa mã OTP có thời hạn 5 phút
            const token = jwt.sign({ email, otp }, secret, { expiresIn: '5m' });

            // Gửi OTP qua email
            await sendOtpEmailLogIn(email, otp);

            console.log(`Generated OTP: ${otp}`);
            resolve({
                status: 'OK',
                message: 'OTP sent successfully',
                token
            });

        } catch (e) {
            reject(e);
        }
    });
};
const checkOTPSignUp = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { otp, token, email, name, OK } = newUser;
        try {
            const decoded = jwt.verify(token, secret);

            // console.log('Decoded OTP:', decoded.otp);
            // console.log('User entered OTP:', otp);

            if(email && name && token && otp && !OK) {
                // Kiểm tra xem OTP có đúng và không hết hạn không
                // console.log('decoded.otp === otp', decoded.otp === otp)
                if (decoded.otp === otp) {
                    resolve({
                        status: 'OK',
                        message: 'OTP verified successfully'
                    });
                } else {
                    resolve({
                        status: 'OK',
                        message: 'Invalid OTP'
                    });
                }
            } else if(email && name && token && otp && OK) {
                // Kiểm tra xem OTP có đúng và không hết hạn không
                if (decoded.otp === otp) {
                    resolve({
                        status: 'OK',
                        message: 'OTP verified successfully'
                    });
                } else {
                    resolve({
                        status: 'ERR',
                        message: 'Invalid OTP'
                    });
                }
            }
        } catch (e) {
            if(email && name && token && otp && !OK) {
                reject({
                    status: 'OK',
                    message: 'Token is invalid or expired'
                });
            } else if(email && name && token && otp && OK) {
                reject({
                    status: 'ERR',
                    message: 'Token is invalid or expired'
                });
            }
        }
    });
};
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {email, password, confirmPassword, token, otp, name} = newUser
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
            
            // const decoded = jwt.verify(token, secret);

            // // Kiểm tra xem OTP có đúng và không hết hạn không
            // if (decoded.otp === otp) {
            //     resolve({
            //         status: 'OK',
            //         message: 'OTP verified successfully'
            //     });
            // } else {
            //     resolve({
            //         status: 'ERR',
            //         message: 'Invalid OTP'
            //     });
            // }

            // viết như này nó sẽ tự động map cái key với cái name với nhau
            const createUser = await User.create({
                name,
                email,
                // mình lưu cái password đã mã hóa vào 
                password: password, 
                // password: hash, 

                // này ko cẩn thiệt lưu
                // confirmPassword: hash, 
            })
            // console.log('createUser', createUser)
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
        const {email, password, OK} = userLogin
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
            //    console.log('checkUser', checkUser)
            if(!OK && email && password){
                if(checkUser === null) {
                    resolve({
                        status: 'OK',
                        // thông báo tài khoảng chưa tồn tại
                        message: 'The user is not defined'
                    })
                }
            } else if(email && password && OK) {
                if(checkUser === null) {
                    resolve({
                        status: 'ERR',
                        // thông báo tài khoảng chưa tồn tại
                        message: 'The user is not defined'
                    })
                }
            }
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
            
            // console.log('user', user)
            // nếu ko gióng thì in ra thông báo
            if (!user) {
                // console.log('user')
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
const checkDetailsUserByEmailApp = (emailUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            // chuyển cái email gửi từ client lên với kiểu string
            // sau đó chuyển sang email
            const emailUser1 = emailUser.email; 

            // check xem 2 id có giống nhau ko
            const user = await User.findOne({
                email: emailUser1
            })
            
            // console.log('user', user)
            // nếu ko gióng thì in ra thông báo
            if (!user) {
                // console.log('user')
                resolve({
                    status: 'OK',
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
                message: 'SUCCESS',
                data: user
            });
            
        } catch (e) {
            reject(e)
        }
    })
}
const checkDetailsUserByOTP = (otpAndPassword) => {
    return new Promise(async (resolve, reject) => {
        const { otp, email, OK } = otpAndPassword;
        try {
            // const emailUser = email.email; 
            const user = await User.findOne({ email: email });

            if(otp && user && !OK) {
                // Check if the user exists
                if (!user) {
                    resolve({
                        status: 'OK',
                        message: 'User not found'
                    });
                    return;
                }
                // console.log('user.otpExpiry', user.otpExpiry < Date.now(), user.otp)
                // Check if OTP matches and OTP is not expired
                if (user.otp !== otp || user.otpExpiry < Date.now()) {
                    resolve({
                        status: 'OK',
                        message: 'Expired or invalid OTP'
                    });
                    return;
                }
            } else if(otp && user && OK) {
                // Check if the user exists
                if (!user) {
                    resolve({
                        status: 'ERR',
                        message: 'User not found'
                    });
                    return;
                }
                // console.log('user.otpExpiry', user.otpExpiry < Date.now(), user.otp)
                // Check if OTP matches and OTP is not expired
                if (user.otp !== otp || user.otpExpiry < Date.now()) {
                    resolve({
                        status: 'ERR',
                        message: 'Expired or invalid OTP'
                    });
                    return;
                }
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
        const { otp, email, anewpassword, password, passwordRetrieval } = newChangePassword;
        // console.log('newChangePassword', newChangePassword)
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

            // const hashedPassword = await bcrypt.hash(anewpassword, 10);
            if(anewpassword) {
                if (user.otp !== otp || user.otpExpiry < Date.now()) {
                    resolve({
                        status: 'ERR',
                        message: 'Expired or invalid OTP'
                    });
                    return;
                }
                user.password = anewpassword;
            } else if (password && passwordRetrieval) {
                if (user.otp !== otp || user.otpExpiry < Date.now()) {
                    resolve({
                        status: 'OK',
                        message: 'Expired or invalid OTP'
                    });
                    return;
                }
                if(password === passwordRetrieval) {
                    user.password = password;
                }
            }
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
    ChangePassword,
    checkOTPSignUp,
    checkEmailSignUp,
    checkDetailsUserByEmailApp
}