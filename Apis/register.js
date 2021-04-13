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

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./uploads/");
          },
          filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
          }

      });
    const fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/jpeg' || file.mimetype === "image/png")  {
        cb(null, true);
      }
      else {
        cb(null, false);
      }
    }
    const upload = multer({
      storage: storage,
      limits: {
        filesize: 1024 * 1024 * 5
      },
      fileFilter: fileFilter
    });

    router.post("/register/:post", upload.single('imageData'), function(req, res) {

      const post = req.params.post;

      if (post == "Student") {
           const fname = req.headers.fname;
           const lname = req.headers.lname;
           const phone = req.headers.phone;
           const username = req.headers.username;
           const password = req.headers.password;
           const student = new Student({
            fName: fname,
            lName: lname,
            phone: phone,
            username: username,
             password: "",
             imageName:req.body.imageName,
             imageData:req.file.path
           });

          bcrypt.hash(password, SaltRounds, (err, hashedPassword) => {
            if (err) {
              res.send({Error:"Something Went Wrong"});
            } else {
              student.password = hashedPassword;
              student.save();
              res.send("Registered");
            }


          })

      } else if (post == "Teacher") {
        const fname = req.headers.fname;
        const lname = req.headers.lname;
        const phone = req.headers.phone;
        const username = req.headers.username;
        const password = req.headers.password;
        const teacher = new Teacher({
         fName: fname,
         lName: lname,
         phone: phone,
         username: username,
          password: "",
          imageName:req.body.imageName,
          imageData:req.file.path
        });

       bcrypt.hash(password, SaltRounds, (err, hashedPassword) => {
         if (err) {
             res.send({Error:"Something Went Wrong"});
         } else {
           teacher.password = hashedPassword;
           teacher.save();
           res.send("Registered");
         }


       })
      } else {
        res.send({Error:"Invalid Request"});
      }
    });
    module.exports=router;
