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
router.get("/dashboard/Host/AllotmentData",async function(req,res){
  try{
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId;
    Host.findOne({username:userId},async function(err,resp){
      if(err){
        res.send({Error:"Something Went Wrong"});
      }
      else if(!resp){
        res.send({Error:"Invalid Request"});
      }
      else{
        Allotment.find({}, async function(err,results){
          if(err || results.length==0){
            res.send({Error:"Something Went Wrong"});
          }
          else{
            var details=[];
            results.forEach(async (data,index) =>{
              if(data.teacherId){
                const tdata = await Teacher.findOne({_id:data.teacherId})
                  if(!tdata){
                    res.send({Error:"Something Went Wrong"});
                  }
                  else{
                    details.push({
                      class:data.class,
                      subject:data.subject,
                      name:tdata.fName+" "+tdata.lName,
                      email:tdata.username
                    })
                  }
              }
              else{
                details.push({
                  class:data.class,
                  subject:data.subject,
                  name:"Not Alloted",
                  email:"Not Alloted"
                })
              }
              if(details.length==results.length){
                res.send(details);
              }
            })
          }
        })
      }
    })
  }catch {
    res.send({Error:"Something Went Wrong"});
  }
})


 router.post("/dashboard/Host/AllotTeacher",function(req,res){
   try{

     const token = req.headers.authorization.split(' ')[1];

     const decodedToken = jwt.verify(token, process.env.SECRET);
     const userId = decodedToken.userId;

     Host.findOne({username:userId},function(err,results){
       if(err){
         res.send({Error:"Something Went Wrong"});
       }
       else if(!results){
         res.send({Error:"Invalid Request"});
       }
       else{
         const _class=req.body.class;
         const _subject=req.body.subject;
         const temail=req.body.email;
         Allotment.findOne({class:_class,subject:_subject},function(err,cres){
           if(err || !cres){
            res.send({Error:"Something Went Wrong"});
           }
           else{
             if(cres.teacherId){
              res.send({Error:"Teacher Already Alloted"});
             }
             else{
               const filter = {
                 class: _class,
                 subject: _subject
               };

               Teacher.findOne({username:temail},function(err,tres){
                 if(err || !tres){
                  res.send({Error:"Something Went Wrong"});
                 }
                 else{
                   Allotment.updateOne(filter, {teacherId:tres._id}, function(err) {
                     if (err) {

                       return res.send({Error:"Something Went Wrong"});
                     }
                   });
                   Course.updateMany(filter, {id:tres._id,teachername:tres.fName+" "+tres.lName}, function(err) {
                     if (err) {

                       return res.send({Error:"Something Went Wrong"});
                     }
                   });
                   res.send("Done");
                 }
               })
             }
           }
         })
       }
     })
   } catch {
     res.send({Error:"Something Went Wrong"});
}})


 var tdata=[];
 router.post("/dashboard/host/fetchTedata",function(req,res){
   try{
     const token = req.headers.authorization.split(' ')[1];
     const decodedToken = jwt.verify(token, process.env.SECRET);
     const userId = decodedToken.userId;
     Host.findOne({username:userId},function(err,results){
       if(err){
         res.send({Error:"Something Went Wrong"});
       }
       else if(!results){
         res.send({Error:"Invalid Request"});
       }
       else{
         const _class=req.body.class;
         const _subject=req.body.subject;


         TCourse.find({class:_class,subject:_subject},function(err,tresults){
           if(err){
            res.send({Error:"Something Went Wrong"});
           }
           else if(tresults.length==0){
             res.send({Error:"No Teacher Available"});
           }
           else{
             tdata=[];

             tresults.forEach((result, index) =>{
               Teacher.findOne({_id:result.id},function(err,tres){
                 if(err || tres.length==0){
                  res.send({Error:"Something Went Wrong"});
                 }
                 else{

                   tdata.push({name:tres.fName+" "+tres.lName,
                   email:tres.username
                 });

                 if (tdata.length == tresults.length) {

                   res.send(tdata);
                 }

               }

               })



             })

           }
         })
       }
     })
   }catch {
     res.send({Error:"Something Went Wrong"});
 }});
 module.exports=router;
