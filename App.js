const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const cors=require("cors");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

 const fetchroutes = require('./Apis/fetch.js');
 const loginroutes= require('./Apis/login.js');
 const registerroutes= require('./Apis/register.js');
 const courseregisterroutes= require('./Apis/CourseRegister.js');
 const dashboardroutes= require('./Apis/dashboard.js');
 const teacherroutes= require('./Apis/Teacherapi.js');
 const hostroutes= require('./Apis/Hostapi.js');

 app.use(bodyParser.urlencoded({
   extended: true
 }));
 app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.json())
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "GET, POST",
}




app.use(cors(corsOptions));
mongoose.connect("mongodb+srv://Admin-Naman:naman1506@cluster0.3tnxy.mongodb.net/TaskDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex",true)

app.use('/api', loginroutes);
app.use('/api', fetchroutes);
app.use('/api', registerroutes);
app.use('/api', courseregisterroutes);
app.use('/api', dashboardroutes);
app.use('/api', teacherroutes);
app.use('/api', hostroutes);



app.listen(4000,function(){
  console.log("Running");
})
