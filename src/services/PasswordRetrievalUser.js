const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendOtpEmail = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let content = `
        <div style="padding: 20px; background-color: #f7f7f7; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Yêu cầu lấy lại mật khẩu</h2>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bạn đã yêu cầu lấy lại mật khẩu. Dưới đây là mã OTP của bạn:</p>
                <p style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Vui lòng nhập mã OTP này để hoàn tất quá trình lấy lại mật khẩu. Mã OTP này sẽ hết hạn sau 10 phút.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Nếu bạn không yêu cầu lấy lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 8px;">Trân trọng,</p>
                <p style="color: #333; font-size: 16px;">Đội ngũ hỗ trợ của chúng tôi</p>
            </div>
        </div>
    `;

    let mailOptions = {
        from: "nkhai96000@gmail.com",
        to: email,
        subject: "Thông báo đặt hàng thành công",
        html: `${content}`
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            // Xử lý lỗi ở đây
        } else {
            console.log('Message sent: ' + info.response);
            // Xử lý thành công ở đây
        }
    });
};

const sendOtpEmailLogIn = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let content = `
        <div style="padding: 20px; background-color: #f7f7f7; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Yêu cầu đăng ký tài khoảng đăng nhập</h2>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Bạn đã yêu cầu đăng ký tài khoảng đăng nhập. Dưới đây là mã OTP của bạn:</p>
                <p style="color: #333; font-size: 24px; font-weight: bold; margin-bottom: 20px;">${otp}</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Vui lòng nhập mã OTP này để hoàn tất quá trình đăng ký tài khoảng đăng nhập. Mã OTP này sẽ hết hạn sau 10 phút.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Nếu bạn không yêu cầu đăng ký tài khoảng đăng nhập, vui lòng bỏ qua email này.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 8px;">Trân trọng,</p>
                <p style="color: #333; font-size: 16px;">Đội ngũ hỗ trợ của chúng tôi</p>
            </div>
        </div>
    `;

    let mailOptions = {
        from: "nkhai96000@gmail.com",
        to: email,
        subject: "Mã Xác Nhận",
        html: `${content}`
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            // Xử lý lỗi ở đây
        } else {
            console.log('Message sent: ' + info.response);
            // Xử lý thành công ở đây
        }
    });
};

module.exports = {
    sendOtpEmail,
    sendOtpEmailLogIn
};
