const batchManagement = require("../models/batchManagementModel");

const batchGetStatus = async (req) => {
    try {
        const batch = req.batch;
        const getBatchData = await batchManagement.findOne({ batch: batch });
        const batchStatus = getBatchData["status"];
        return batchStatus
    } catch (err) {
        return err
    }
}

const batchRestriction = async (req, res, next) => {
    // catch the lastest Batch if we dont send batch into request
    const status = await batchGetStatus(req);
    if (status == "open") {
        next();
    } else {
        res.status(403).json({message: "This batch is end, please create a new batch"})
    }
};

module.exports = batchRestriction;