const Visit = require("../models/VisitModel");

const createNumberOfVisits = async (newVisit, ip) => {
    return new Promise(async (resolve, reject) => {
        const { userAgent, startTime, endTime, duration } = newVisit;
        let visit = await Visit.findOne({ ip });
        console.log('visit', visit)
        try {
            if (visit) {
                visit.visits = visit.visits + 1; 
                visit.totalDuration = visit.totalDuration + duration;
                visit.averageDuration = visit.totalDuration / visit.visits; 
                visit.endTime = new Date(endTime); 
                visit.duration = duration;

                await visit.save(); 
                resolve({
                    status: 'OK',
                    message: 'Visit updated successfully',
                    data: visit,
                });
            } else {
                const createVisit = await Visit.create({
                    ip,
                    userAgent,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    duration,
                    visits: 1,
                    totalDuration: duration,
                    averageDuration: duration,
                });

                if (createdComment) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createVisit
                    });
                } else {
                    resolve({
                        status: 'error',
                        message: 'Failed to createVisit'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getNumberOfVisits = () => {
    // return new Promise(async (resolve, reject) => {
    //     try {
    //         const allComments = await Comment.find({ id_product: id_product });
    //         resolve({
    //             status: 'OK',
    //             message: 'Success',
    //             data: allComments
    //         });
    //     } catch (e) {
    //         reject(e);
    //     }
    // });
};


module.exports = {
    createNumberOfVisits,
    getNumberOfVisits
};

