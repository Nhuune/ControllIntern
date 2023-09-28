const cron = require("node-cron");
const batchManagement = require("../models/batchManagementModel");
const reportingBatchManagement = require("../models/reportingBatchManagementModel");
const { candidateDataFilterByRequest } = require("./candidateDataFilter");
const { getReportByID } = require("./httpPost");
const sentEmailScheduleModel = require("../models/sentEmailScheduleModel");

sendingWeeklyReport = async () => {
  cron.schedule("0 17 * * 5", async () => {
    const totalBatch = await batchManagement.find();
    const activeBatches = _.filter(totalBatch, function (batch) {
      return batch.status !== "Closed";
    });
    for (const activeBatch of activeBatches) {
      try {
        let newWeek = 0;
        const lastReporting = await reportingBatchManagement
          .find({ batch: activeBatch.batch })
          .sort([["week", -1]]);
        if (lastReporting.length !== 0) {
          newWeek = lastReporting[0]["week"] + 1;
        }
        const result = await getReportByID(activeBatch.batch);
        const newReporting = {
          batch: activeBatch.batch,
          week: newWeek,
          ...result,
        };
        const newBatchManagement = new reportingBatchManagement(newReporting);
        await newBatchManagement.save();
        const user = await batchManagement.findById(activeBatch["_id"]);
        await user.updateOne({ $push: { report: newBatchManagement._id } });
      } catch (error) {
        console.log(error);
      }
    }
  });

  async function getCronTime() {
    const data = await sentEmailScheduleModel.findOne({});
    if (data === null) {
      return `30 8 * * *`;
    }
    const { time, dayOfMonth, dayOfWeek, weekInterval, status } = data;

    if (status === false) {
      return null;
    }

    const timePart = time.split(":");
    const hour = timePart[0];
    const minute = timePart[1];
    if (!dayOfMonth && !dayOfWeek) {
      return `${minute} ${hour} * * *`;
    }
    if (dayOfMonth) {
      if (dayOfMonth === "*") {
        return `${minute} ${hour} * * *`;
      }
      return `${minute} ${hour} ${dayOfMonth} * *`;
    }
    if (weekInterval && dayOfWeek) {
      const dayOfWeekExpression = dayOfWeek.join(",");
      if (weekInterval == 0 || weekInterval <= 0) {
        return `${minute} ${hour} * * ${dayOfWeekExpression}`;
      }
      return `${minute} ${hour} * * ${dayOfWeekExpression} */${weekInterval}`;
    }
  }

  async function updateSchedule() {
    const cronTime = await getCronTime();
    if (cronTime !== null) {
      cron.schedule(cronTime, async () => {
        await candidateDataFilterByRequest();
      });
    }
  }

  await updateSchedule();
  sentEmailScheduleModel.watch().on('change', async () => {
    await updateSchedule();
  });

}
module.exports = sendingWeeklyReport