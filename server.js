require("dotenv").config();
//Import npm packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const _ = require("lodash");
//Config MongoDB Database
const app = express();
const MONGODB_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8080;

const dbConnect = async () => {
  try {
    await mongoose.connect(
      MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
    );
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
const server = app.listen(PORT, async () => {
  console.log(`Server is starting at ${PORT}`);
  await dbConnect().then((res) => {
  });
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//HTTP request logger
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(morgan());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const checkBatch = require("./middleware/checkBatch");
app.use("*", checkBatch);

//Config Router
//Batch Manage Router
const batchManageRouter = require("./routes/batchManagementRouter");
app.use("/batch-management", batchManageRouter);

//Candidate router
const candidateRouter = require("./routes/candidateRouter");
app.use("/candidate-list", candidateRouter);

//Intern ResourceNeed Router
const internResourceNeedRouter = require("./routes/internresourceneedRouter");
app.use("/intern-resource-need", internResourceNeedRouter);

//Interview Information Router
const interviewInformationRouter = require("./routes/interviewInformationRouter");
app.use("/interview-information", interviewInformationRouter);

//Interview Result Router
const interviewResultRouter = require("./routes/interviewResultRouter");
app.use("/interview-result", interviewResultRouter);

//Interview Schedule router
const interviewScheduleRouter = require("./routes/interviewscheduleRouter");
app.use("/interview-schedule", interviewScheduleRouter);

//List Of Intern Router
const listOfInternRouter = require("./routes/listOfInternRouter");
app.use("/list-of-intern", listOfInternRouter);

//List University Router
const listUniversity = require("./routes/listUniversityRouter");
app.use("/list-university", listUniversity);

//User Router
const listUser = require("./routes/listUserRouter");
app.use("/list-users", listUser);

//Manual Sending Email Router
const manualSendingEmailRouter = require("./routes/manualSendingMailRouter");
app.use("/manual-sending-email", manualSendingEmailRouter);

//Reporting Batch Management Router
const reportingBatchManagementRouter = require("./routes/reportingBatchManagementRouter");
app.use("/reporting-batch-management", reportingBatchManagementRouter);

//List Roles User Router
const roleUserRouter = require("./routes/roleUserRouter");
app.use("/role-users", roleUserRouter);

//SkillLanguage Router
const skillLanguageRouter = require("./routes/skillLangueRouter");
app.use("/skill-language", skillLanguageRouter);

// Sent Email Schedule Router
const sentEmailScheduleRouter = require("./routes/sentEmailScheduleRouter");
app.use("/sent-email-schedule", sentEmailScheduleRouter);

//Training Plan Router
const trainingPlanRouter = require("./routes/trainingplanRouter");
app.use("/training-plan", trainingPlanRouter);

module.exports = server