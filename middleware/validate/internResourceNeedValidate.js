const validate = require("validate.js");

const validationSchema = {
  internResourceNeed: {
    presence:true,
    type: "number",
    numericality: {
      onlyInteger: true,
    },
  },
};

const internResourceNeedValidateMiddleWare = (req, res, next) => {
  validationErrors = validate(req.body, validationSchema);
  if (validationErrors) {
    res.json({ error: validationErrors });
  } else {
    next();
  }
};

module.exports = {
    internResourceNeedValidateMiddleWare
}
