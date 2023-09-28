const batchManagement = require("../models/batchManagementModel");

const checkBatchForUser = async (body) =>{
    try{
        const batch = body.batch;
        if (batch) {
            return batch
        } 
        const getBatchData = await batchManagement.find().sort([["batch",-1]]);
        const getBatch = getBatchData[0]["batch"];
        return getBatch
    } catch (err) {
        return err
    }
}

const checkAndGetBatch = async (req, res, next) => {
    // catch the lastest Batch if we dont send batch into request
    req.batch = await checkBatchForUser(req.body);
    next();
};

module.exports = checkAndGetBatch;