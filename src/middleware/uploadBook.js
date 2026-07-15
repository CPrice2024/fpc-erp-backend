import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    destination(req,file,cb){

        cb(null,"uploads/books");

    },

    filename(req,file,cb){

        cb(
            null,
            Date.now() +
            "-" +
            file.originalname
        );

    }

});

const fileFilter=(req,file,cb)=>{

    const allowed=[
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx"
    ];

    const ext=path.extname(file.originalname).toLowerCase();

    if(allowed.includes(ext))
        cb(null,true);

    else
        cb(new Error("Unsupported file type"));

};

export default multer({

    storage,

    fileFilter,

    limits:{
        fileSize:20*1024*1024
    }

});