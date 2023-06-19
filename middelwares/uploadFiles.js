const multer=require('multer');
const ApiError = require("../util/apiErrors");

const multerOtions=()=>{
    //diskStorage
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         console.log(file.mimetype);
//         cb(null,'upload/cats')
//     },
//     filename:function(req,file,cb){
//         const ext=file.mimetype.split('/')[1];
//         const fileName=`cat-${uuid()}-${Date.now()}.${ext}`;
//         cb(null,fileName);
//     }
// });
// const upload=multer({storage:storage,fileFilter:multerFilter});
const storage = multer.memoryStorage();//memoryStorage
const multerFilter=function(req,file,cb){
    if(file.mimetype.startsWith("image")){
        cb(null,true);
    }else{
        cb(new ApiError('upload image only','',400),false);
    }
};
   const upload = multer({ storage: storage,fileFilter: multerFilter});
   return upload;
};
exports.uploadSingleFile = (fieldName) =>{ return multerOtions().single(fieldName)};
exports.uploadMultiFiles=(arrOfFields)=>{   return  multerOtions().fields(arrOfFields); };



