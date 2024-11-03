const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    // thông tin đặt hàng
    orderItems: [
        {
            name: { type: String, required: true },
            // số lượng sản phẩm
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            // giảm giá
            discount: { type: Number },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    // thông tin giao hàng
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: Number, required: true },
    },
    // hình thức thanh toán
    paymentMethod: { type: String, required: true },
    // giá tiền tạm tính
    itemsPrice: { type: Number, required: true },
    // phí giao hàng
    shippingPrice: { type: Number, required: true },
    // tổng giá tiền
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // trạng thái thanh toán
    isPaid: { type: Boolean, default: false },
    // thời gian đặt hàng
    paidAt: { type: Date },
    // nơi giao hàng
    deliveredAt: { type: Date },

    // trạng thái giao hàng hay chưa
    isDelivered: { type: Boolean, default: false },
    // Xác nhận đơn hàng
    OrderConfirmation: { type: Boolean, default: false },
    // Trạng thái đã nhận hàng chưa
    DeliveryStatus: { type: Boolean, default: false },
    // trạng thái hủy đơn
    cancellationStatus: { type: Boolean, default: false },
    // trạng thái trả về lại đơn hàng
    returnStatus: { type: Boolean, default: false },
    // trạng thái shipping giao hàng cho khách chưa
    shippingStatus: { type: Boolean, default: false },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order