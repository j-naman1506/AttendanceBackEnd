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

    var studentdata = [];
    router.post("/dashboard/:post/fetchStdata", function(req, res) {
      const post=req.params.post;

      try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if(post=="Teacher"){
          Teacher.findOne({
            username: userId
          }, function(err, results) {
            if (err) {
                res.send({Error:"Something Went Wrong"});
            } else {
                if(!results){
                    res.send({Error:"Invalid Request"});
                }

                const _class = req.body.class;
                const _subject = req.body.subject;
                const date=req.body.date;

               Allotment.findOne({class:_class,subject:_subject,teacherId:results._id},function(err,adata){
                 if(err){
                     res.send({Error:"Something Went Wrong"});
                 }
                 else if(!adata){
                     res.send({Error:"You are not Registered for this Course"});
                 }
                 else{
                   let flag = 1;
                   for (let i = 0; adata.date && i < adata.date.length; i++) {
                     if (adata.date[i] === date) {
                       flag  = 0;
                       break;
                     }
                   }

                   if (flag) {
                     Course.find({
                       class: _class,
                       subject: _subject,
                       id: results._id
                     }, function(err, sresults) {
                       if (err) {
                          res.send({Error:"Something Went Wrong"});
                       }
                       else if(!sresults){
                           res.send({Error:"No one Registered for this Course"});
                       }
                        else {
                         var sdetails = [];

                         sresults.forEach((detail) => {
                           sdetails.push({
                             name: detail.fName + ' ' + detail.lName,
                             username: detail.username
                           })



                         })
                         if (sdetails.length == 0) {
                              res.send({Error:"No one Registered for this Course"});
                         } else {
                           res.send(sdetails);
                         }


                       }
                     })
                   }
                   else{
                        res.send({Error:"Attendance Already Marked for this Date"});
                   }


                 }
               })



            }
          })
        }
        else if(post=="Host"){
          Host.findOne({username:userId}, function(err,results){
            if(err){
            res.send({Error:"Something Went Wrong"});
            }
            else if(!results){
              res.send({Error:"Invalid Request"});
            }
            else{
              const _class=req.body.class;
              Course.find({class:_class}, function(err,results){
                if(err){
                  res.send({Error:"Something Went Wrong"});
                }
                else{
                  if (results.length) {
                  studentdata=[];
                  results.forEach( (data, index) =>{
                      Course.find({class:_class,username:data.username}, function(err, cdetails) {
                        Student.findOne({username:data.username},function(err,sdetails){
                          studentdata.push({
                            name:data.fName+" "+data.lName,
                            email:data.username,
                            phone:sdetails.phone,
                            totalcourses:cdetails.length
                          })
                          if (index === results.length - 1) {

                            var obj = {};

                            for ( var i=0, len=studentdata.length; i < len; i++ )
                               obj[studentdata[i]['email']] = studentdata[i];

                                  studentdata = new Array();
                            for ( var key in obj )
                              studentdata.push(obj[key]);

                            res.send(studentdata);
                          }
                        })

                  })
                  })
                  } else {
                    res.send({Error:"No One Registered for this Class"});
                  }

                }
              })
            }
          })
        }


      } catch {
        res.send({Error:"Something Went Wrong"});
      }



    });



    module.exports = router;
