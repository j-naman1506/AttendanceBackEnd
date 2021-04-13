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

router.post("/dashboard/:post/courseRegister", function(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const post = req.params.post;
    if (post === "Student") {
      Student.findOne({
        username: userId
      }, function(err, results) {
        if (err) {
            res.send({Error:"Something Went Wrong"});
        } else {
          if (results) {

            const uid = results._id;
            const fName = results.fName;
            const lName = results.lName;
            const username = results.username;

              const clas = req.body.class;
              const subjec = req.body.subject;

              Allotment.findOne({
                class: clas,
                subject: subjec
              }, function(err, tdetails) {
                if (err) {
                  res.send({Error:"Something Went Wrong"});
                } else {
                  console.log(tdetails);
                  if (tdetails.teacherId) {
                    const tid = tdetails.teacherId;
                    Teacher.findOne({
                      _id: tid
                    }, function(err, details) {
                      if (err) {
                        res.send({Error:"Something Went Wrong"});

                      } else {
                        if (details) {
                          const tname = details.fName + ' ' + details.lName;
                          const detail = new Course({
                            id: tid,
                            class: clas,
                            subject: subjec,
                            teachername: tname,
                            total: tdetails.date.length,
                            current: 0,
                            fName: fName,
                            lName: lName,
                            username: username,
                            date:[],
                          })
                          Course.findOne({
                            username:username,
                            class: clas,
                            subject: subjec
                          }, function(err, course) {
                            if (err)   res.send({Error:"Something Went Wrong"});
                            else {
                              if(course){
                                res.send({Error:"Course Already Registered"});
                              }
                              else{
                                detail.save(function(err) {
                                  if (!err) {
                                    res.send("CourseRegistered");
                                  } else {
                                    res.send({Error:"Something Went Wrong"});
                                  }
                                })
                              }

                            }
                          })
                        } else {
                          res.send({Error:"Something Went Wrong"});
                        }
                      }
                    })
                  } else {
                    const detail = new Course({
                      id: "",
                      class: clas,
                      subject: subjec,
                      teachername: "Not Alloted",
                      total: 0,
                      current: 0,
                      fName: fName,
                      lName: lName,
                      username: username,
                      date:[],
                    })
                    Course.findOne({
                      username:username,
                      class: clas,
                      subject: subjec
                    }, function(err, course) {
                      if (err)   res.send({Error:"Something Went Wrong"});
                      else {
                        if(course){
                          res.send({Error:"Course Already Registered"});
                        }
                        else{
                          detail.save(function(err) {
                            if (!err) {
                              res.send("CourseRegistered");
                            } else {
                              res.send({Error:"Something Went Wrong"});
                            }
                          })
                        }

                      }
                    })
                  }

                }

              })




          } else {
            res.send({Error:"Invalid Request"});
          }

        }
      })
    } else {
      Teacher.findOne({
        username: userId
      }, function(err, results) {
        if (err) {
          res.send({Error:"Something Went Wrong"});
        } else {
          if (results) {
            const tid = results._id;


              const clas = req.body.class;
              const subjec = req.body.subject;

              const tdetails = new TCourse({
                id: tid,
                class: clas,
                subject: subjec
              })
              TCourse.findOne({
                id: tid,
                class: clas,
                subject: subjec
              }, function(err, course) {
                if (err)   res.send({Error:"Something Went Wrong"});
                else {
                  tdetails.save(function(err) {
                    if (!course) {
                      res.send("CourseRegistered");
                    } else {
                        res.send({Error:"Course Already Registered"});
                    }
                  })
                }
              })



          } else {
              res.send({Error:"Invalid Request"});
          }

        }
      })
    }

  } catch {
      res.send({Error:"Something Went Wrong"});
  }

})
module.exports=router;
