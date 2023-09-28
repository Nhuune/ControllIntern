const validate = require("validate.js");

const validationSchema = {
  date:{
    presence:true,
    datetime: {
      dateOnly: true,
    },
  },
  batch: {
    presence:true,
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
};

const interviewInformationValidateMiddleWare = (req, res, next) => {
  validationErrors = validate(req.body, validationSchema);
  if (validationErrors) {
    res.json({ error: validationErrors });
  } else {
    next();
  }
};

module.exports = {
    interviewInformationValidateMiddleWare
}
