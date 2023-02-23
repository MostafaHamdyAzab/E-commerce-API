const {check,validationResult}=require('express-validator');
const ApiError = require('../util/apiErrors');
const slugify=require('slugify');
//validate MiddelWare
const brandValidatorMiddelWare=  ((req,res,nxt)=>{
    const errors=validationResult(req);
    // process.env.MSG =  (errors.mapped().id)?errors.mapped().id.msg:"";
    // process.env.MSG += (errors.mapped().name)?  errors.mapped().name.msg:"";
    // // console.log(errors.array()[0].msg)
    if(!errors.isEmpty()){
        return res.status(400).json({err:errors.array()})
        // return nxt(new ApiError("",process.env.MSG,400));
    }
        nxt();
    
    });


const brandIdVAlidator=check('id').isMongoId().withMessage('Invalid Cat ID Format');

const brandNameValidator=
        check('name').notEmpty().withMessage("Cat Name Is required")
        .isLength({min:3}).withMessage("Too Short Cat Name")
        .isLength({max:32}).withMessage("Too Long Cat Name")
        .custom((val,{req})=>{
            req.body.slug=slugify(val);
            return true;
        });

exports.getBrandValidator=[brandIdVAlidator,brandValidatorMiddelWare];
exports.updateBrandValidator=[brandIdVAlidator,brandNameValidator,brandValidatorMiddelWare];
exports.deleteBrandValidator=[brandIdVAlidator,brandValidatorMiddelWare];
exports.createBrandValidator=[brandNameValidator,brandValidatorMiddelWare];

