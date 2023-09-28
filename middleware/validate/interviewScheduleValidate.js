const interviewScheduleValidateMiddleWare = (req, res, next) => {
  let validationErrors = null
  const batch = req.body.batch
  if(isNaN(+batch)){
    validationErrors = "Batch must be of type number"
  }
  if (validationErrors) {
    res.json({ error: validationErrors });
  } else {
    next();
  }
};

module.exports = {
  interviewScheduleValidateMiddleWare,
};
