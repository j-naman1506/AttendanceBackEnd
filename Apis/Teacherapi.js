const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const SaltRounds = 10;
const multer = require('multer');
const app = express();
app.use('/uploads',express.static('uploads'));
const {
  StudentSchema,
  TeacherSchema,
  CourseSchema,
  TCourseSchema,
  HostSchema,
  AllotmentSchema

} = require('./models.js');


const Student = new mongoose.model("Student", StudentSchema);
const Teacher = new mongoose.model("Teacher", TeacherSchema);
const Course = new mongoose.model("Course", CourseSchema);
const TCourse = new mongoose.model("TCourse", TCourseSchema);
const Host=new mongoose.model("Host",HostSchema);
const Allotment=new mongoose.model("Allotment",AllotmentSchema);

router.post("/dashboard/Teacher/MarkAttendance", function(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    Teacher.findOne({
      username: userId
    }, function(err, results) {
      if(err){
        res.send({Error:"Something Went Wrong"});
      }
      else if(!results){
        res.send({Error:"Invalid Request"});
      } else {


          const __class = req.body.class;
          const __subject = req.body.subject;
          const pdata = req.body.present;
          const date=req.body.date;

          const filter = {
            class: __class,
            subject: __subject
          };
          Allotment.findOne({class:__class,subject:__subject,teacherId:results._id},function(err,adata){
            if(err){
                res.send({Error:"Something Went Wrong"});
            }
            else if(!adata){
                res.send({Error:"You are not Registered for this Course"});
            }
            else{
              Allotment.updateOne({class:__class,subject:__subject,teacherId:results._id},{$push: { date: date }},function(err){
                if (err) {

                  return res.send({Error:"Something Went Wrong"});
                }
              })
              const addatte = {
                $inc: {
                  total: 1,
                },
              };
              Course.updateMany(filter, addatte, function(err) {
                if (err) {

                  return res.send({Error:"Something Went Wrong"});
                }
              });
              var newfi = {
                class: __class,
                subject: __subject,
                username: ""
              };
              const patt = {
                $inc: {
                  current: 1,
                },
                $push:{
                  date:date,
                }
              }

              const push = pdata.forEach((data) => {
                newfi.username = data;
                Course.updateOne(newfi, patt, function(err) {
                  if (err) {

                    return res.send({Error:"Something Went Wrong"});
                  }
                });

              })

              return res.send("Done");
            }
          })







      }

    })
  } catch {
    res.send({Error:"Something Went Wrong"});
  }

});

router.post("/dashboard/Teacher/fetchAttendance", function(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
      Teacher.findOne({username:userId},function(err,results){
        if(err){
          res.send({Error:"Something Went Wrong"});
        }
        else if(!results){
          res.send({Error:"Invalid Request"});
        }
        else{
          Allotment.findOne({class:req.body.class,subject:req.body.subject,teacherId:results._id},function(err,adata){
            if(err){
                res.send({Error:"Something Went Wrong"});
            }
            else if(!adata){
                res.send({Error:"You are not Registered for this Course"});
            }
            else{
              Course.find({
                class: req.body.class,
                subject: req.body.subject
              }, function(err, results) {
                if(err){
                    res.send({Error:"Something Went Wrong"});
                }
                else if(!results){
                    res.send({Error:"No One Registered for this Course"});
                } else {
                  var attedata = [];
                  results.forEach((reg) => {
                    attedata.push({
                      name: reg.fName + ' ' + reg.lName,
                      username: reg.username,
                      current: reg.current,
                      total: reg.total,
                      percentage: Math.floor((reg.current / reg.total) * 100)
                    })
                  })
                  res.send(attedata);
                }
              })

            }
          })
        }
      })


  } catch {
      res.send({Error:"Something Went Wrong"});
  }


});
module.exports=router;
