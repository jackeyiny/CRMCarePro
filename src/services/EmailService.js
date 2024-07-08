const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrder = async (orderItems, email) => {
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
                <h2 style="color: #333;">Thông báo đặt hàng thành công!</h2>
    `;

    orderItems.forEach((order) => {
        const { name, amount, price } = order;

        content += `
            <p style="color: #333; font-size: 16px; margin-bottom: 8px;">Tên sản phẩm: ${name}</p>
            <p style="color: #333; font-size: 16px; margin-bottom: 8px;">Số lượng: ${amount}</p>
            <p style="color: #333; font-size: 16px; margin-bottom: 8px;">Giá: ${price}</p>
        `;
    });

    content += `
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng của bạn đã được xác nhận và đang được xử lý. Bạn sẽ nhận được thông tin vận chuyển trong thời gian sớm nhất.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Chúng tôi rất trân trọng sự ủng hộ của bạn và hy vọng bạn sẽ hài lòng với sản phẩm của mình.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Cảm ơn bạn một lần nữa và chúc bạn một ngày tốt lành!</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 8px;">Trân trọng,</p>
                <p style="color: #333; font-size: 16px;">Đội ngũ cửa hàng chúng tôi</p>
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

module.exports = {
    sendEmailCreateOrder
};
