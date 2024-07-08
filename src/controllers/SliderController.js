const sliderService = require('../services/SliderService')

const createSlider = async (req, res) => {
    try {
        const { name, image} = req.body
        if(!name || !image ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await sliderService.createSlider(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            err: e
        })
    }
}

const updateSlider = async (req, res) => {
    try {
        const sliderId = req.params.id
        const data = req.body
        if(!sliderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The sliderId id is required'
            })
        }
        const response = await sliderService.updateSlider(sliderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsSlider = async (req, res) => {
    try {
        const sliderId = req.params.id
        if(!sliderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The sliderId id is required'
            })
        }
        const response = await sliderService.getDetailsSlider(sliderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteSlider = async (req, res) => {
    try {
        const sliderId = req.params.id
        if(!sliderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The sliderId id is required'
            })
        }
        const response = await sliderService.deleteSlider(sliderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
 
const deleteSliderMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if(!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids id is required'
            })
        }
        const response = await sliderService.deleteSliderMany(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllSlider = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await sliderService.getAllSlider(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createSlider,
    getAllSlider, 
    updateSlider, 
    deleteSlider, 
    deleteSliderMany, 
    getDetailsSlider
}