const validate = require("validate.js");

const validationSchemaPost = {
  batch: {
    presence: true,
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  week: {
    presence: true,
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  recruitment: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  processingCandidate: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  waitingForSubmission: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  canceledApplication: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  failedInterview: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  rejectedByIndustryInternship: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  transferred: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  acceptedForInternship: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  duringInternship: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  deniedOffer: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  haveNotJoinedYet: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  practicing: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  finished: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  terminated: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  withdrew: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  offerJobs: {
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
};

const validationSchemaPostNow = {
  batch: {
    presence: true,
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
}

const reportingBatchManagementValidateMiddleWare = (req, res, next) => {
  validationErrors = validate(req.body, validationSchemaPost);
  if (validationErrors) {
    res.json({ error: validationErrors });
  } else {
    next();
  }
};

const reportingBatchManagementPostNowValidateMiddleWare = (req, res, next) => {
  validationErrors = validate(req.body, validationSchemaPostNow);
  if (validationErrors) {
    res.json({ error: validationErrors });
  } else {
    next();
  }
};

module.exports = {
  reportingBatchManagementValidateMiddleWare,
  reportingBatchManagementPostNowValidateMiddleWare
};
