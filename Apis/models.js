const mongoose = require('mongoose')

const RegisterSchemaStudent = new mongoose.Schema ({
  fName:{type:String},
  lName:{type:String},
  phone:{type:String},

    username: {type:String ,unique:true,required:true},
    password:{type:String},
    imageName:{type:String,default:"none",required:true},
    imageData:{type:String,required:true}


});
const HostSchema=new mongoose.Schema({
  fName:{type:String},
  lName:{type:String},
  phone:{type:String},
    username: {type:String ,unique:true,required:true},
    password:{type:String},
    imageName:{type:String,default:"none",required:true},
    imageData:{type:String,required:true}
})

const CourseSchema= new mongoose.Schema({
  id:{type:String},
  class:{type:String},
  subject:{type:String},
  teachername:{type:String},
  total:{type:Number},
  current:{type:Number},
  fName:{type:String},
  lName:{type:String},
  username:{type:String},
  date:{type:Array}

})
const TCourseSchema= new mongoose.Schema({
  id:{type:String},
  class:{type:String},
  subject:{type:String}
})
const RegisterSchemaTeacher = new mongoose.Schema ({
  fName:{type:String},
  lName:{type:String},
  phone:{type:String},
    username: {type:String ,unique:true,required:true},
    password: {type:String},
    imageName:{type:String,default:"none",required:true},
    imageData:{type:String,required:true}
});
const AllotmentSchema=new mongoose.Schema({
  class:{type:String},
  subject:{type:String},
  teacherId:{type:String},
  date:{type:Array}

})


module.exports.StudentSchema = RegisterSchemaStudent;
module.exports.TeacherSchema = RegisterSchemaTeacher;
module.exports.CourseSchema=CourseSchema;
module.exports.TCourseSchema=TCourseSchema;
module.exports.HostSchema=HostSchema;
module.exports.AllotmentSchema=AllotmentSchema;

// module.exports.Student = Student;
// module.exports.Teacher = Teacher;
// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJuajEyM0BnbWFpbC5jb20iLCJpYXQiOjE2MTUzNzQ1NjR9.eda_I9AaITmzqup-afjkvUhq55YQ4sHcskExf9Np_w4"
// }
