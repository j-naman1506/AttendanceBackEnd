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



router.post("/login/:post", function(req, res) {
      const post = req.params.post;
      if (post == 'Student') {

          const username = req.body.username;
          const password = req.body.password;

          Student.findOne({
            username: username
          }, function(err, results) {
            if (err) {
            res.send({Error:"Something Went Wrong"});
            } else {
              if (results) {
                bcrypt.compare(password, results.password, function(err, resp) {
                  if (resp) {
                    const token = jwt.sign({
                        userId: username
                      },
                      process.env.SECRET
                    );

                    res.status(200).json({
                      token: token
                    });
                  } else {
                    res.send({Error:"Invalid Password"})
                  }
                })

              } else {
              res.send({Error:"Invalid Username"})
              }
            }

        })
      } else if (post == 'Teacher') {
        const username = req.body.username;
        const password = req.body.password;

        Teacher.findOne({
          username: username
        }, function(err, results) {
          if (err) {
            res.send({Error:"Something Went Wrong"});
          } else {
            if (results) {
              bcrypt.compare(password, results.password, function(err, resp) {
                if (resp) {
                  const token = jwt.sign({
                      userId: username
                    },
                    process.env.SECRET
                  );

                  res.status(200).json({
                    token: token
                  });
                } else {
                  res.send({Error:"Invalid Password"})
                }
              })

            } else {
              res.send({Error:"Invalid Username"})
            }
          }

      })
    } else if(post=="Host") {
      const username = req.body.username;
      const password = req.body.password;
      Host.findOne({
        username: username
      }, function(err, results) {
        if (err) {
          res.send({Error:"Something Went Wrong"});
        } else {
          if (results) {
            bcrypt.compare(password, results.password, function(err, resp) {
              if (resp) {
                const token = jwt.sign({
                    userId: username
                  },
                  process.env.SECRET
                );

                res.status(200).json({
                  token: token
                });
              } else {
                res.send({Error:"Invalid Password"})
              }
            })

          } else {
            res.send({Error:"Invalid Username"})
          }
        }

    })
      }
      else{
        res.send({Error:"Something Went Wrong"});
      }
    })
  module.exports = router;
