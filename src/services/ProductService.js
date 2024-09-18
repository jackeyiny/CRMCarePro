const Product = require("../models/ProductModel")
// dùng để mã hóa mật khẩu
// const bcrypt = require("bcrypt")

// làm như này nó sẽ tự động thêm lên database cho mình
const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {

        // nhận những dữ liệu dx gửi qua từ phía client
        const { name, type, countInStock, price, rating, description, discount } = newProduct
        // const { name, image, type, countInStock, price, rating, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
          
            if(checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of product is already'
                })
            }
            
            // viết như này nó sẽ tự động map cái key với cái name với nhau
            const createdProduct = await Product.create({
                name, 
                type, 
                price, 
                countInStock: Number(countInStock), 
                rating, 
                description, 
                discount: Number(discount)
            })
            // nếu tồn tại createUser thì sẽ thực hiện thông báo thành công và trả về data
            if(createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    // nhận dữ liệu
                    data: createdProduct
                })
            }
            
        } catch (e) {
            // console.log('e', e)
            reject(e)
        }
    })
}

// này để update sản phẩm
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const checkProduct = await Product.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (checkProduct === null) {
                resolve({
                    status: 'ok',
                    message: 'The product is not defined'
                })
            }

            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in ra thông tin product theo id
const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const product = await Product.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (product === null) {
                resolve({
                    status: 'ok',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get product Success',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

// delete Product
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check xem 2 id có giống nhau ko
            const checkProduct = await Product.findOne({
                _id: id
            })
            // nếu ko gióng thì in ra thông báo
            if (checkProduct === null) {
                resolve({
                    status: 'ok',
                    message: 'The product is not defined'
                })
            }

            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

// delete many product
const deleteProductMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            // nếu giống thì thực hiện gọi tới hàm --findByIdAndUpdate-- chuyền id và data vào tiến hành update
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete many product success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

// in thông tin toàn bộ user user ra
// ta sẽ chuyền vào --limit-- đây là số sản phẩm trên 1 trang
// chuyền tiếp vào số --page-- là cái trang mình đang đứng
const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allProduct = []
            // nhận về cái filter
            // console.log("filter1", filter)

            // nhận về cái sắp xếp theo chiều tăng dấn --asc--
            // console.log("sort", sort)
            

            let totalProduct;
            
            // khi trang tìm kiếm có --type--
            if (filter && filter.length === 2) {
                // --filter[0] và filter[1]-- ta chuyền vào từ url lần lượt là ---name và tên--- 
                const name = filter[0]

                // Tìm kiếm không phân biệt hoa thường
                const regex = new RegExp(filter[1], 'i'); 

                // hiển thị ra khi tìm kiếm theo type
                totalProduct = await Product.countDocuments({ [name]: regex });
            } else {
                // khi tìm kiếm tất cả sản phẩm
                totalProduct = await Product.countDocuments()
            }
            


            // -----tìm kiếm gần giống tên----
            // --filter-- này là tìm kiếm ko nhất thiết tên phải giống nhau nó sẽ tìm gần đúng với tên
            if (filter) {
                
                // --filter[0] và filter[1]-- ta chuyền vào từ url lần lượt là ---name và tên--- 
                const name = filter[0]
                // Tìm kiếm không phân biệt hoa thường
                const regex = new RegExp(filter[1], 'i'); 
                
                // --limit(limit).skip(0)-- nghĩa là lấy --limit-- sản phẩm in ra trên 1 trang lấy bắt đầu từ vị trí số --page*limit--
                // --sort-- dùng để sắp xếp theo theo chiều nào tùy mình chuyền vào 
                const allObjectFilter = await Product.find({ [name]: regex  }).limit(limit).skip(page * limit)
                

                resolve({
                    status: 'OK',
                    message: 'getAll allObjectFilter Success',
                    data: allObjectFilter,
                    // tổng số sản phẩm
                    total: totalProduct,
                    // trang hiện tại đang đứng
                    pageCurrent: Number(page + 1),
                    // tổng số trang = tổng số sản phẩm chia cho số sản phẩm trên 1 trang
                    totalPage: Math.ceil(totalProduct / limit)
                })

            } 



            // ---- tìm kiếm theo tên đúng và sắp xếp  ---
            if (sort) {
                // console.log('okok')

                // ta sẽ chuyền 2 biến --sort=asc và sort=name-- nó sẽ tự biến thành 1 cái object 
                // nên sẽ sẽ tạo ra 1 cái object để chứa nó
                const objectSort = {}

                // vị trí số 1 là --name-- và vị trí số 2 là --asc--
                objectSort[sort[1]] = sort[0]
                // console.log('objectSort', objectSort)

                // --limit(limit).skip(0)-- nghĩa là lấy --limit-- sản phẩm in ra trên 1 trang lấy bắt đầu từ vị trí số --page*limit--
                // --sort-- dùng để sắp xếp theo theo chiều nào tùy mình chuyền vào 
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)

                resolve({
                    status: 'OK',
                    message: 'getAll allProductSort Success',
                    data: allProductSort,
                    // tổng số sản phẩm
                    total: totalProduct,
                    // trang hiện tại đang đứng
                    pageCurrent: Number(page + 1),
                    // tổng số trang = tổng số sản phẩm chia cho số sản phẩm trên 1 trang
                    totalPage: Math.ceil(totalProduct / limit)
                })

            }

            // --limit()-- dùng để xuất hiện 2 sản phẩm trên 1 trang page
            // const allProduct = await Product.find().limit(limit)

            // --skip()-- dùng để bỏ qua 2 sản phầm đầu để lấy từ sản phẩm thứ 3 ra
            // const allProduct = await Product.find().skip(2)



            // nếu ko có chuyền vào limit thì
            if(!limit) {
                // in ra tất cả sản phẩm
                allProduct = await Product.find()
            } else { 
                // ----tìm kiếm tất cả----
                // --limit(limit).skip(0)-- nghĩa là lấy --limit-- sản phẩm in ra trên 1 trang lấy bắt đầu từ vị trí số --page*limit--
                allProduct = await Product.find().limit(limit).skip(page * limit)
            }
            
            
            resolve({
                status: 'OK',
                message: 'getAll allProduct Success',
                data: allProduct,
                // tổng số sản phẩm
                total: totalProduct,
                // trang hiện tại đang đứng
                pageCurrent: Number(page + 1),
                // tổng số trang = tổng số sản phẩm chia cho số sản phẩm trên 1 trang
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllProductType = () => {
    return new Promise(async (resolve, reject) => {
        try {    
            const result = await Product.find()
            
            resolve({
                status: 'OK',
                message: 'getAll allProduct Success',
                data: result
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


// ------------
const getSellingProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy 8 sản phẩm bán được nhiều nhất
            const topSellingProducts = await Product.find().sort({ selled: -1 }).limit(8);
            
            resolve({
                status: 'OK',
                message: 'Top selling products retrieved successfully',
                data: topSellingProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getNewProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy 8 sản phẩm mới nhất
            const newProducts = await Product.find().sort({ createdAt: -1 }).limit(8);
            // console.log('newProducts', newProducts)
            
            resolve({
                status: 'OK',
                message: 'New products retrieved successfully',
                data: newProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getHighestPricedProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy 8 sản phẩm có giá cao nhất
            const highestPricedProducts = await Product.find().sort({ price: -1 }).limit(8);
            // console.log('highestPricedProducts', highestPricedProducts)

            resolve({
                status: 'OK',
                message: 'Highest priced products retrieved successfully',
                data: highestPricedProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getLowestPricedProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy 8 sản phẩm có giá thấp nhất
            const lowestPricedProducts = await Product.find().sort({ price: 1 }).limit(8);
            // console.log('lowestPricedProducts', lowestPricedProducts)

            resolve({
                status: 'OK',
                message: 'Lowest priced products retrieved successfully',
                data: lowestPricedProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getRandomProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Lấy 8 sản phẩm ngẫu nhiên
            const randomProducts = await Product.aggregate([{ $sample: { size: 8 } }]);
            // console.log('randomProducts', randomProducts)

            resolve({
                status: 'OK',
                message: 'Random products retrieved successfully',
                data: randomProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};
   

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteProductMany,
    getAllTypeProduct,
    getSellingProducts, 
    getNewProducts, 
    getHighestPricedProducts, 
    getRandomProduct,
    getLowestPricedProducts,
    getAllProductType
}