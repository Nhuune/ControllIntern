const nodemailer = require("nodemailer");
const userModel = require("../models/userModel");
const moment = require('moment');
require("dotenv").config();
const SenderHelper = exports;

SenderHelper.sendingEmail = async (email, batch, data) => {
  const dataUsers = await userModel.findOne({})
  if (dataUsers === null) {
    return
  }
  let transporter = nodemailer.createTransport({
    host: "smtp.Company.com.vn",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: dataUsers.email, // generated ethereal process.env.EMAIL_APP 
      pass: dataUsers.password, // generated ethereal process.env.EMAIL_APP_PASS
    },
    debug: true, // show debug output
  });
  // structure HTML to send
  let today = new Date();
  let sendDate = new Date(today.setUTCDate(today.getUTCDate() + 1));
  let hour = sendDate.getHours();
  let month = sendDate.toLocaleString("default", { month: "short" });
  let day = sendDate.getDate();
  const weekNumber = moment(today).week();
  let formatSendDate = hour + 'h, ' + month + ' ' + day;
  let sendingFile =
    '\
        <div style="margin-bottom:10px">Dear PM</div>\
        <span> We have ' + data.length + ' selected candidates available for BU1 now, please review their profiles and book the interviews for the ones you want before </span>\
        <span style="color: red; font-weight: bold; margin-bottom:8px">'+ formatSendDate + '</span>\
        <table style="border: 1px solid #333; overflow-x: auto; border-collapse: collapse;">\
            <tbody> \
                <tr style="background-color: #609ed6; color: #fff">\
                    <th style="border: 1px solid #333; padding:7px"> Full name </th>\
                    <th style="border: 1px solid #333; padding:7px"> Profile </th>\
                    <th style="border: 1px solid #333; padding:7px;> Domain </th>\
                    <th style="border: 1px solid #333; padding:7px"> Uniname </th>\
                    <th style="border: 1px solid #333; padding:7px"> Faculty </th>\
                    <th style="border: 1px solid #333; padding:7px"> Year </th>\
                    <th style="border: 1px solid #333; padding:7px"> Graduation Year </th>\
                    <th style="border: 1px solid #333; padding:7px"> GPA </th>\
                    <th style="border: 1px solid #333; padding:7px"> When are you available to work?</th>\
                    <th style="border: 1px solid #333; padding:7px"> Type of internship </th>\
                    <th style="border: 1px solid #333; padding:7px"> Joined Intern Program? </th>\
                    <th style="border: 1px solid #333; padding:7px"> Internship is compulsory </th>\
                    <th style="border: 1px solid #333; padding:7px"> Programming </th>\
                    <th style="border: 1px solid #333; padding:7px"> Testing </th>\
                    <th style="border: 1px solid #333; padding:7px"> Other Skills </th>\
                    <th style="border: 1px solid #333; padding:7px"> Link </th>\
                </tr>';
  for (const {
    _id,
    everJoinedCompany,
    faculty,
    firstPriority,
    fullName,
    GPA,
    graduationYear,
    linkCV,
    otherSkills,
    programming,
    secondPriority,
    startDate,
    testing,
    typeOfInternship,
    university,
    universityCompulsoryRequirement,
    year,
  }
    of data) {
    sendingFile +=
      '\<tr>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + fullName + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">\
                <span class="Object" role="link" id="OBJ_PREFIX_DWT45_com_zimbra_url">\
                    <a href="' + linkCV + '" target="_blank" rel="nofollow noopener noreferrer">' + fullName + '</a>\
                </span>\
            </td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + firstPriority + "<br>" + secondPriority + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + university + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + faculty + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + year + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + graduationYear + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + GPA + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + startDate + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + typeOfInternship + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + everJoinedCompany + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + universityCompulsoryRequirement + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + programming + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + testing + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">' + otherSkills + '</td>\
            <td style="border: 1px solid #333; padding:7px; text-align: left;">\
                <span class="Object" role="link" id="OBJ_PREFIX_DWT45_com_zimbra_url">\
                  <a href="'+ process.env.URLSERVER + _id + '?action=view" target="_blank" rel="nofollow noopener noreferrer">Link detail</a>\
                </span>\
            </td>\
        </tr>';
  }
  sendingFile +=
    '\
            </tbody>\
        </table>\
        <div style="margin-top:10px">Thanks and Best regards,</div>'
  const mailOptions = {
    from: `"Company"<${dataUsers.email}>`, // sender address
    to: `${email}`, // list of receivers 
    cc: `"Industry Internship" <${process.env.EmailII}>`,
    subject: `[ Batch ${batch} ] Internship Candidates #week ${weekNumber} `, // Subject line
    html: sendingFile,
  };
  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

SenderHelper.sendingRejectEmail = async ({
  email,
  password,
  subject,
  content,
  candidateEmail,
  candidateName,
}) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.Company.com.vn",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: email, // generated ethereal process.env.EMAIL_APP
        pass: password, // generated ethereal process.env.EMAIL_APP_PASS
      },
      debug: true, // show debug output
      logger: true, // log information in console
    });
    let sendingFile = `
        <div style="color: #1F497D;font-size:11p;font-family: calibri, sans-serif;">
            <p>Dear ${candidateName},</p>
            <div style="white-space: pre-line;">${content}</div>
            <p>Best regards,</p>
            <div>
                <img style="float: left; margin: 0px 12px; width: 150px;" src="${process.env.LogoCompany}">
                <div style="float: left;">
                    <div style="font-size: 10.5pt;color:#27AEE1"><b>Company Academy - Industry Internship</b></div>
                    <div><b style="font-size: 10pt;">Company Solutions</b> | <a style="font-size: 8.5pt;" target="_blank" rel="nofollow noopener noreferrer" href="mailto:intern@Company.com.vn">intern@Company.com.vn</a> <span style="color:#515152;font-size: 7.5pt;">| Website:</span> <a href="http://www.Companysolutions.com/" style="color:#A76585;font-size: 7.5pt;" target="_blank" rel="nofollow noopener noreferrer">www.Companysolutions.com</a></div>
                    <div style="font-size: 7.5pt;">Tel: <a href="callto:+84 (28)3997 8000">+84(28)3997 8000</a> | Ext:<a href="callto:5615-5524-5236">5615-5524-5236</a> | Facebook: <a href="https://www.facebook.com/Company-Industry-Internship-219301644855211/" style="color:#005A95" target="_blank" rel="nofollow noopener noreferrer">Company-INDUSTRY-INTERNSHIP</a></div>
                </div>
        </div>
        </div>
        `;
    const mailOptions = {
      from: `"Company" <${email}>`, // sender address
      to: `${candidateEmail}`, // list of receivers //data.email.find()
      subject: `${subject}`, // Subject line
      html: sendingFile,
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        resolve({ msg: err, success: false });
      } else {
        resolve({ msg: "Email sent successfully", success: true });
      }
    });
  });
};


SenderHelper.sendingNotifyEmail = async ({
  email,
  password,
  subject,
  content,
  cc,
}) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.Company.com.vn",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: email, // generated ethereal process.env.EMAIL_APP
        pass: password, // generated ethereal process.env.EMAIL_APP_PASS
      },
      debug: true, // show debug output
      logger: true, // log information in console
    });
    let sendingFile = `
        <div style="color: #1F497D;font-size:11p;font-family: calibri, sans-serif;">
            <p>Dear Industry Internship,</p>
            <div style="white-space: pre-line;">${content}</div>
            <p>Best regards,</p>
            <div>
                <img style="float: left; margin: 0px 12px; width: 150px;" src="${process.env.LogoCompany}">
                <div style="float: left;">
                    <div style="font-size: 10.5pt;color:#27AEE1"><b>Company Academy - Industry Internship</b></div>
                    <div><b style="font-size: 10pt;">Company Solutions</b> | <a style="font-size: 8.5pt;" target="_blank" rel="nofollow noopener noreferrer" href="mailto:intern@Company.com.vn">intern@Company.com.vn</a> <span style="color:#515152;font-size: 7.5pt;">| Website:</span> <a href="http://www.Companysolutions.com/" style="color:#A76585;font-size: 7.5pt;" target="_blank" rel="nofollow noopener noreferrer">www.Companysolutions.com</a></div>
                    <div style="font-size: 7.5pt;">Tel: <a href="callto:+84 (28)3997 8000">+84(28)3997 8000</a> | Ext:<a href="callto:5615-5524-5236">5615-5524-5236</a> | Facebook: <a href="https://www.facebook.com/Company-Industry-Internship-219301644855211/" style="color:#005A95" target="_blank" rel="nofollow noopener noreferrer">Company-INDUSTRY-INTERNSHIP</a></div>
                </div>
        </div>
        </div>
        `;
    const mailOptions = {
      from: `"Company" <${email}>`, // sender address
      // to: `"Industry Internship" <${process.env.EmailII}> `, // only use in the production server
      to: `abc@Company.com.vn`, //use when working locally, here's your email
      subject: `${subject}`, // Subject line
      cc: `${cc}`,
      html: sendingFile,
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        resolve({ msg: err, success: false });
      } else {
        resolve({ msg: "Email sent successfully", success: true });
      }
    });
  });
};

SenderHelper.sendingPromoteEmail = async ({
  email,
  password,
  subject,
  content,
  id
}) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.Company.com.vn",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: email, // generated ethereal process.env.EMAIL_APP
        pass: password, // generated ethereal process.env.EMAIL_APP_PASS
      },
      debug: true, // show debug output
      logger: true, // log information in console
    });
    const url = `https://${process.env.URLSERVER}/list-of-intern/${id}`;
    let sendingFile = `
        <div style="color: #1F497D;font-size:11p;font-family: calibri, sans-serif;">
            <p>Dear Industry Internship,</p>
            <div style="white-space: pre-line;">${content}<a href=${url} target="_blank" rel="nofollow noopener noreferrer">Link detail</a>\
            </div>
            <p>Best regards,</p>
            <div>
                <img style="float: left; margin: 0px 12px; width: 150px;" src="${process.env.LogoCompany}">
                <div style="float: left;">
                    <div style="font-size: 10.5pt;color:#27AEE1"><b>Company Academy - Industry Internship</b></div>
                    <div><b style="font-size: 10pt;">Company Solutions</b> | <a style="font-size: 8.5pt;" target="_blank" rel="nofollow noopener noreferrer" href="mailto:intern@Company.com.vn">intern@Company.com.vn</a> <span style="color:#515152;font-size: 7.5pt;">| Website:</span> <a href="http://www.Companysolutions.com/" style="color:#A76585;font-size: 7.5pt;" target="_blank" rel="nofollow noopener noreferrer">www.Companysolutions.com</a></div>
                    <div style="font-size: 7.5pt;">Tel: <a href="callto:+84 (28)3997 8000">+84(28)3997 8000</a> | Ext:<a href="callto:5615-5524-5236">5615-5524-5236</a> | Facebook: <a href="https://www.facebook.com/Company-Industry-Internship-219301644855211/" style="color:#005A95" target="_blank" rel="nofollow noopener noreferrer">Company-INDUSTRY-INTERNSHIP</a></div>
                </div>
        </div>
        </div>

        `;
    const mailOptions = {
      from: `"Company" <${email}>`, // sender address
      // to: `"Industry Internship" <${process.env.EmailII}> `, // only use in the production server
      to: `nhnhu@Company.com.vn`, //use when working locally, here's your email
      subject: `${subject}`, // Subject line
      html: sendingFile,
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        resolve({ msg: err, success: false });
      } else {
        resolve({ msg: "Email sent successfully", success: true });
      }
    });
  });
};