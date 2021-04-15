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
  var classs = [10, 11, 12];
router.get("/:post/dashboard", function(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId;
    const post = req.params.post
    if (post === "Student") {
      Student.findOne({
        username: userId
      }, function(err, results) {
        if (err) {
          res.send({Error:"Something Went Wrong"});
        } else {
          if (results) {
            const uid = results.id;
            Course.find({
              username: userId
            }, function(err, coursedata) {
              if (err) {
                res.send({Error:"Something Went Wrong"});
              } else {
                if (coursedata) {
                  const studentResult = {
                    phone: results.phone,
                    username: results.username,
                    fName: results.fName,
                    lName: results.lName,
                    image: results.imageData.slice(8, results.imageData.length)
                  };

                  var courseResult = [];
                  coursedata.forEach((course) => {
                    courseResult.push({
                      class: course.class,
                      subject: course.subject,
                      teacher: course.teachername,
                      total: course.total,
                      current: course.current
                    });
                  })
                  const response = {
                    student: studentResult,
                    courses: courseResult
                  }
                  res.send(response);
                }
              }
            })


          } else {
            res.send({Error:"Invalid Request"});
          }
        }
      })
    } else if (post === "Teacher") {
      Teacher.findOne({
        username: userId
      }, function(err, results) {
        if (err) {
          res.send({Error:"Something Went Wrong"});
        } else {
          if (results) {
            const tid = results.id;
            Allotment.find({
              teacherId: tid
            }, function(err, coursedata) {
              if (err) {
                res.send({Error:"Something Went Wrong"});
              } else {

                  const teacherResult = {
                    phone: results.phone,
                    username: results.username,
                    fName: results.fName,
                    lName: results.lName,
                    image: results.imageData.slice(8, results.imageData.length)
                  };
                  const courseResult = {};
                  classs.forEach((clas) => {
                    courseResult[clas] = [];
                  })
                  coursedata.forEach((course) => {
                    courseResult[course.class].push(course.subject);
                  })
                  const response = {
                    teacher: teacherResult,
                    tcourses: courseResult
                  }
                  res.send(response);


              }
            })


          } else {
            res.send({Error:"Invalid Request"});
          }
        }
      })
    }
    else if(post==='Host'){
      Host.findOne({username:userId},function(err,results){
        if(err){
          res.send({Error:"Something Went Wrong"});
        }
        else{
          if(!results){
            res.send({Error:"Invalid Request"});
          }
          else{
            const hostResult = {
              phone: results.phone,
              username: results.username,
              fName: results.fName,
              lName: results.lName,
              image: results.imageData.slice(8, results.imageData.length)
            };
            res.send(hostResult);
          }

        }
      })
    }

  } catch {
  res.send({Error:"Something Went Wrong"});
  }
});

module.exports = router;
