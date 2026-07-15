import DigitalBook from "../models/DigitalBook.js";
import User from "../models/User.js";

export const uploadBook=async(req,res)=>{
     console.log("BODY:", req.body);
  console.log("FILE:", req.file);


try{

const teacher=await User.findById(req.user.id)
.populate("course");
if (!teacher) {
  return res.status(404).json({
    message: "Teacher not found",
  });
}

if (!teacher.course) {
  return res.status(400).json({
    message: "Teacher has no assigned course.",
  });
}

if (!req.file) {
  return res.status(400).json({
    message: "Please select a file.",
  });
}

if(!teacher)
return res.status(404).json({
message:"Teacher not found"
});

const book=await DigitalBook.create({

title:req.body.title,

description:req.body.description,

teacher:teacher._id,

course:teacher.course._id,

department:teacher.department,

fileName:req.file.filename,

fileUrl:`/uploads/books/${req.file.filename}`,

fileType:req.file.mimetype,

fileSize:req.file.size

});

res.status(201).json(book);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

export const getCourseBooks=async(req,res)=>{

try{

const books=await DigitalBook.find({

course:req.params.courseId

})
.sort({
createdAt:-1
});

res.json(books);

}catch(error){

res.status(500).json({
message:error.message
});

}

};

export const deleteBook=async(req,res)=>{

try{

const book=await DigitalBook.findById(req.params.id);

if(!book){

return res.status(404).json({
message:"Book not found"
});

}

await book.deleteOne();

res.json({
message:"Book deleted"
});

}catch(error){

res.status(500).json({
message:error.message
});

}

};

export const getBook=async(req,res)=>{

try{

const book=await DigitalBook.findById(req.params.id);

if(!book){

return res.status(404).json({
message:"Book not found"
});

}

res.json(book);

}catch(error){

res.status(500).json({
message:error.message
});

}

};