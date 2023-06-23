const asyncHandler=require('express-async-handler');
const apiError=require('../util/apiErrors');
const ApiError = require("../util/apiErrors");
const ApiFeatures = require("../util/apiFeatures");
const slugify=require('slugify');


exports.deleteOne=(model)=>async(req,res)=>{
    const id=req.params.id;
    let document=await model.findOneAndDelete({_id:id});
    (!document)?res.status(404).json({ msg:"No Category Found"}):res.status(204).json({msg:"Cat Deleted"});
       
    
 };

 exports.applySlugify=(req,res,nxt)=>{
    req.body.slug=slugify(req.body.name);
    nxt();
 };

exports.updateOne=(model)=>(req,res,nxt)=>{
    const id=req.params.id;
    model.findOneAndUpdate(
          {_id:id},
          req.body,
          {new:true  })
       .then((newDocument)=>{
             res.status(200).json({data:newDocument});
       })
       .catch((err)=>{
          // process.env.MSG="Not found Category compat to this id";
          return nxt(new ApiError("","Not found Category compat to this id",404));
       });
       };

exports.createOne=(model)=>(asyncHandler(async(req,res,nxt)=>{
   const document=await model.create(req.body);
   res.status(201).json({data:document});
}));

exports.getOne=(model)=>((req,res,nxt)=>{
   const id=req.params.id;
   model.findById({_id:id})
   .then((document)=>{
      res.status(200).json({data:document}); 
   })
   .catch((err)=>{
      return nxt(new ApiError("",process.env.MSG,404));
   })

});

exports.getAll=(model,modelName='')=>(asyncHandler(async (req,res,nex)=>{
   const NoDocuments=await model.countDocuments();
   const apiFeatures=new ApiFeatures(model.find(),req.query).paginate(NoDocuments).search(modelName).filter().limitFields().sort();
   const document=await apiFeatures.mongooseQuery;
   res.status(200).json({results:document.length,paginationResult:apiFeatures.paginationResult,data:document});
}));

