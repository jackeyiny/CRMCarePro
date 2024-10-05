const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService");

// làm như này nó sẽ tự động thêm lên database cho mình
// const createOrder = (newOrder) => {
//     return new Promise(async(resolve, reject) => {
//         console.log('newOrder11', newOrder)

//         // nhận những dữ liệu dx gửi qua từ phía client
//         const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder
        
//         try {
//             const promises = orderItems.map(async (order) => {
//                 // console.log('orderItems', {orderItems})
//                 const productData = await Product.findOneAndUpdate(
//                     {
//                         _id: order.product,
//                         // kiểm tra xem trong produc có hàng bằng với số lượng hoặc lớn hơn --orderItems?.amount-- hay ko
//                         countInStock: {$gte: order.amount}
//                     },
//                     // sau khi kiếm được
//                     {$inc: {
//                         // tiến hành trừ số lượng đi
//                         countInStock: -order.amount,
//                         selled: +order.amount
//                     }},
//                     // trả về lại cái thằng --quality-- mới nhất sau khi update
//                     {new: true}

//                 )
//                 console.log('productData', productData)
//                 // nếu có sản phẩm này và đủ số lượng để mình mua hàng thì
//                 if(productData) {
//                     // viết như này nó sẽ tự động map cái key với cái name với nhau
//                     const createOrderProduct = await Order.create({
//                         orderItems,
//                         shippingAddress: {
//                             fullName,
//                             address,
//                             city,
//                             phone,
//                         }, 
//                         paymentMethod, 
//                         itemsPrice, 
//                         shippingPrice, 
//                         totalPrice,
//                         user: user,
//                     })
//                     // nếu tồn tại createUser thì sẽ thực hiện thông báo thành công và trả về data
//                     if(createOrderProduct) {
//                         return {
//                             status: 'OK',
//                             message: 'SUCCESS',
//                             // nhận dữ liệu
//                             // data: createOrderProduct
//                         }
//                     }
//                 } else {
//                     //  còn nếu ko có là ko có đủ sản phẩm để bán
//                     return {
//                         status: 'OK',
//                         message: 'ERR',
//                         // trả về những id hết hàng
//                         id: order.product
//                     }
//                 }
//             })

//             const rusults = await Promise.all(promises)
//             // console.log('rusults', rusults)

//             // trả về những cái --id-- đã hết sản phẩm
//             const newData = rusults && rusults.filter((item) => item.id)
//             // nếu tồn tại --id-- này thì in ra ko đủ hàng
//             if(newData.length) {
//                 resolve({
//                     status: 'ERR',
//                     message: `Sản phẩm với id ${newData.join(',')} không đủ hàng`,
//                 })
//             }
//             // nếu không thì in ra thành công
//             resolve({
//                 status: 'OK',
//                 message: 'cuccess',
//             })

//         } catch (e) {
//             console.log('e', e)
//             reject(e)
//         }
//     })
// }

const createOrder = (newOrder) => {
    // console.log('newOrder', newOrder)
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
            let insufficientStock = false; // Biến cờ để kiểm tra xem có sản phẩm nào không đủ hàng hay không
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (!productData) {
                    insufficientStock = true; // Đánh dấu rằng có ít nhất một sản phẩm không đủ hàng
                }
            })

            await Promise.allSettled(promises); // Chờ tất cả các promise kết thúc

            // Kiểm tra nếu có sản phẩm nào không đủ hàng
            if (insufficientStock) {
                resolve({
                    status: 'ERR',
                    message: `Ít nhất một sản phẩm trong đơn hàng không đủ hàng`
                });
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, 
                    paidAt
                });

                if (createdOrder) {
                    await EmailService.sendEmailCreateOrder(orderItems, email)
                    resolve({
                        status: 'OK',
                        message: 'Đặt hàng thành công'
                    });
                } else {
                    resolve({
                        status: 'ERR',
                        message: 'Lỗi khi tạo đơn hàng'
                    });
                }
            }
            

        } catch (e) {
            // console.log('e', e);
            reject(e);
        }
    });
}

// này để update sản phẩm
const UpdateOrder = (id, data) => {
    // console.log('datatesst', data)
    // console.log('datatesst11', id)
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const checkOrder = await Order.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (checkOrder === null) {
                resolve({
                    status: 'ok',
                    message: 'The product is not defined'
                })
            }

            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            const updateOrder = await Order.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in ra thông tin product theo id
const getAllOrderDetail = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const order = await Order.find({
                user: userId
            })
            // nếu ko gióng thì in ra thông báo
            if (order === null) {
                resolve({
                    status: 'ok',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get order Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsOrder = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const order = await Order.findById({
                _id: userId
            })
            // console.log('order', order)
            // nếu ko gióng thì in ra thông báo
            if (order === null) {
                resolve({
                    status: 'ok',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get order Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}


// delete Product
const cancelOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            const order = await Order.findByIdAndDelete(id)

            // nếu thành công thì in ra thông báo
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }
            
            // console.log('order1111', order)

            resolve({
                status: 'OK',
                message: 'Delete Order success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in thông tin toàn bộ user user ra
const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success order',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
} 


const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // tìm kiếm --1 trường duy nhất-- trong 1 product
            const allTypeProduct = await Product.distinct('type')
            
            resolve({
                status: 'OK',
                message: 'allTypeProduct Success',
                data: allTypeProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createOrder,
    getAllOrderDetail,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    UpdateOrder
}