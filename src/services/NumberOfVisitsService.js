const Visit = require("../models/VisitModel");

const createNumberOfVisits = async (newVisit, ip) => {
    const { userAgent, startTime, endTime, duration } = newVisit;

    // Lấy ngày từ startTime hoặc endTime (chỉ lấy ngày, không giờ phút)
    const visitDate = new Date(startTime);
    const visitDay = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate());

    try {
        // Tìm lượt truy cập của IP trong cùng ngày
        let visit = await Visit.findOne({ ip, date: visitDay });

        if (visit) {
            // Nếu lượt truy cập trong ngày đã tồn tại, cập nhật thông tin
            visit.visits += 1;
            visit.totalDuration += duration;
            visit.averageDuration = visit.totalDuration / visit.visits;  // Tính lại thời gian trung bình
            visit.endTime = new Date(endTime);
            visit.duration = duration;

            await visit.save();  // Lưu lại dữ liệu cập nhật
            return {
                status: 'OK',
                message: 'Visit updated successfully',
                data: visit,
            };
        } else {
            // Nếu chưa có lượt truy cập trong ngày, tạo mới
            const createVisit = await Visit.create({
                ip,
                userAgent,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                duration,
                visits: 1,
                totalDuration: duration,
                averageDuration: duration,  // Khi chỉ có 1 lượt truy cập, averageDuration = duration
                date: visitDay,  // Lưu ngày truy cập
            });

            if (createVisit) {
                return {
                    status: 'OK',
                    message: 'Visit created successfully',
                    data: createVisit,
                };
            } else {
                return {
                    status: 'error',
                    message: 'Failed to create new visit',
                };
            }
        }
    } catch (e) {
        console.error(e);  // In lỗi ra console để debug
        throw new Error('An error occurred while processing the visit');
    }
};


const getNumberOfVisits = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allVisit = await Visit.find();
            resolve({
                status: 'OK',
                message: 'Success',
                data: allVisit
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createNumberOfVisits,
    getNumberOfVisits
};

