const NumberOfVisitsService = require('../services/NumberOfVisitsService')

const createNumberOfVisits = async (req, res) => {
    try {
        const { userAgent, startTime, endTime, duration } = req.body;
        console.log('userAgent', userAgent)
        console.log('startTime', startTime)
        console.log('endTime', endTime)
        console.log('duration', duration)
        const ip = req.clientIp;
        console.log('ip', ip)

        const response = await NumberOfVisitsService.createNumberOfVisits(req.body, ip)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            err: e
        })
    }
}

const getNumberOfVisits = async (req, res) => {
    try {
        const response = await NumberOfVisitsService.getNumberOfVisits();

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message
        });
    }
}

module.exports = {
    createNumberOfVisits,
    getNumberOfVisits
}