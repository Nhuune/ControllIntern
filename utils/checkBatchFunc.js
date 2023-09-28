const checkBatchHelper = exports;

checkBatchHelper.checkBatchForUse = async () => {
    try {
        const getBatchData = await batchManagement.find().sort([["batch", -1]]);
        const getBatch = getBatchData[0]["batch"];
        return getBatch
    } catch (err) {
        return err
    }
}