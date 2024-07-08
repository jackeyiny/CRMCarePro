const Slider = require("../models/SliderModel")

const createSlider = (newSlider) => {
    return new Promise(async (resolve, reject) => {
        const { name, image } = newSlider
        try {
            const checkSlider = await Slider.findOne({
                name: name
            })
          
            if(checkSlider !== null) {
                resolve({
                    status: 'OK',
                    message: 'The name of slider is already'
                })
            }
            
            const createdSlider = await Slider.create({
                name, 
                image, 
            })
            
            if(createdSlider) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdSlider
                })
            }   
        } catch (e) {
            reject(e)
        }
    })
}

const updateSlider = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkSlider = await Slider.findOne({
                _id: id
            })

            if (checkSlider === null) {
                resolve({
                    status: 'ok',
                    message: 'The Slider is not defined'
                })
            }

            const updateSlider = await Slider.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateSlider
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsSlider = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const slider = await Slider.findOne({
                _id: id
            })

            if (slider === null) {
                resolve({
                    status: 'ok',
                    message: 'The slider is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get slider Success',
                data: slider
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteSlider = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkSlider = await Slider.findOne({
                _id: id
            })

            if (checkSlider === null) {
                resolve({
                    status: 'ok',
                    message: 'The Slider is not defined'
                })
            }

            await Slider.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete Slider success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteSliderMany = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Slider.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete many Slider success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllSlider = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let allSlider = []
            let totalSlider;
            
            // khi trang tìm kiếm có --type--
            if (filter && filter.length === 2) {
                // --filter[0] và filter[1]-- ta chuyền vào từ url lần lượt là ---name và tên--- 
                const name = filter[0]
                // Tìm kiếm không phân biệt hoa thường
                const regex = new RegExp(filter[1], 'i'); 
                // hiển thị ra khi tìm kiếm theo type
                totalSlider = await Slider.countDocuments({ [name]: regex });
            } else {
                // khi tìm kiếm tất cả sản phẩm
                totalSlider = await Slider.countDocuments()
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
                const allObjectFilter = await Slider.find({ [name]: regex  }).limit(limit).skip(page * limit)               

                resolve({
                    status: 'OK',
                    message: 'getAll allObjectFilter Success',
                    data: allObjectFilter,
                    // tổng số sản phẩm
                    total: totalSlider,
                    // trang hiện tại đang đứng
                    pageCurrent: Number(page + 1),
                    // tổng số trang = tổng số sản phẩm chia cho số sản phẩm trên 1 trang
                    totalPage: Math.ceil(totalSlider / limit)
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
                const allSliderSort = await Slider.find().limit(limit).skip(page * limit).sort(objectSort)

                resolve({
                    status: 'OK',
                    message: 'getAll allSliderSort Success',
                    data: allSliderSort,
                    // tổng số sản phẩm
                    total: totalSlider,
                    // trang hiện tại đang đứng
                    pageCurrent: Number(page + 1),
                    // tổng số trang = tổng số sản phẩm chia cho số sản phẩm trên 1 trang
                    totalPage: Math.ceil(totalSlider / limit)
                })

            }

            // nếu ko có chuyền vào limit thì
            if(!limit) {
                // in ra tất cả sản phẩm
                allSlider = await Slider.find()
            } else { 
                // ----tìm kiếm tất cả----
                // --limit(limit).skip(0)-- nghĩa là lấy --limit-- sản phẩm in ra trên 1 trang lấy bắt đầu từ vị trí số --page*limit--
                allSlider = await Slider.find().limit(limit).skip(page * limit)
            }
            
            
            resolve({
                status: 'OK',
                message: 'getAll allSlider Success',
                data: allSlider,
                // tổng số sản phẩm
                total: totalSlider,
                // trang hiện tại đang đứng
                pageCurrent: Number(page + 1),
                // tổng số trang = tổng số sản phẩm chia cho số sản phẩm trên 1 trang
                totalPage: Math.ceil(totalSlider / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSlider,
    getAllSlider, 
    updateSlider, 
    deleteSlider, 
    deleteSliderMany, 
    getDetailsSlider
}