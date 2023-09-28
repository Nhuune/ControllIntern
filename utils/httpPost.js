const http = require('http');
const Candidate = require("../models/candidateModel");
const listOfInternModel = require("../models/listOfInternModel");
const _ = require("lodash");
const httpHelper = exports;

httpHelper.httpsPost = async ({ body, ...options }) => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      method: 'POST',
      ...options,
    }, res => {
      const chunks = [];
      res.on('data', data => chunks.push(data))
      res.on('end', () => {
        let resBody = Buffer.concat(chunks);
        resBody = JSON.parse(resBody);
        resolve(resBody)
      })
    })
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  })
}

const getReportByID = async (batch) => {
  const recruitment = ['Finding project', 'Transferred', 'Failed application', 'Canceled application',
    'Waiting for result', 'Waiting for admission test', 'Failed interview', 'Failed 1st interview', 'Passed', 'Rejected', 'Denied offer'];
  const duringInternship = ['Have not joined yet', 'Practicing', 'Finished', 'Terminated', 'Withdrew', 'Offered job'];
  try {
    const candidateData = await Candidate.find({ batch });
    const listOfInternData = await listOfInternModel.find({ batch });
    const dataInternship = {};
    _.forEach(duringInternship, function (filterInternship) {
      dataInternship[filterInternship] = _.filter(listOfInternData, function (listOfInternData) {
        return listOfInternData.statusIntern == filterInternship;
      }).length;
    })
    const dataCandidate = {};
    _.forEach(recruitment, function (filterCandidate) {
      dataCandidate[filterCandidate] = _.filter(candidateData, function (candidateData) {
        return candidateData.status == filterCandidate;
      }).length;
    })
    let candidateTotal = 0;
    let internshipTotal = 0;
    for (const key in dataInternship) {
      internshipTotal += (typeof (dataInternship[key])) == "number" ? dataInternship[key] : Number(dataInternship[key]);
    }
    for (const key in dataCandidate) {
      candidateTotal += (typeof (dataCandidate[key])) == "number" ? dataCandidate[key] : Number(dataCandidate[key]);
    }
    const sentDataInternship = {
      "Recruitment": candidateTotal,
      ...dataCandidate,
      "DuringInternship": internshipTotal,
      ...dataInternship
    }
    const newReport = {
      recruitment: sentDataInternship['Recruitment'],
      processingCandidate: sentDataInternship['Waiting for result'] + sentDataInternship['Finding project'],
      waitingForSubmission: sentDataInternship['Waiting for admission test'],
      canceledApplication: sentDataInternship['Canceled application'],
      failedInterview: sentDataInternship['Failed interview'] + sentDataInternship['Failed 1st interview'],
      rejectedByIndustryInternship: sentDataInternship['Rejected'],
      transferred: sentDataInternship['Transferred'],
      acceptedForInternship: sentDataInternship['Passed'] + sentDataInternship['Denied offer'],
      duringInternship: sentDataInternship['DuringInternship'],
      deniedOffer: sentDataInternship['Denied offer'],
      haveNotJoinedYet: sentDataInternship['Have not joined yet'],
      practicing: sentDataInternship['Practicing'],
      finished: sentDataInternship['Finished'],
      terminated: sentDataInternship['Terminated'],
      withdrew: sentDataInternship['Withdrew'],
      offerJobs: sentDataInternship['Offered job']
    }
    return newReport
  } catch (err) {
    return err
  }
}

module.exports = {
  getReportByID
}