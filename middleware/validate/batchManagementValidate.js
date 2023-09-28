const validate = require("validate.js");
const moment = require("moment");

validate.extend(validate.validators.datetime, {
  parse: function (value, options) {
    return +moment.utc(value);
  },

  format: function (value, options) {
    var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
    return moment.utc(value).format(format);
  },
});

const validationSchema = {
  batch: {
    presence:true,
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
  startDate: {
    presence:true,
    datetime: {
      dateOnly: true,
    },
  },
  endDate: {
    presence:true,
    datetime: {
      dateOnly: true,
    },
  },
  skill: {
    presence: true,
  },
};

const batchManagementValidateMiddleWare = (req, res, next) => {
  validationErrors = validate(req.body, validationSchema);
  if (validationErrors) {
    res.json({ error: validationErrors });
  } else {
    next();
  }
};

module.exports = {
  batchManagementValidateMiddleWare,
};
