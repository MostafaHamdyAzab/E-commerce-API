const {check,validationResult}=require('express-validator');
const ApiError = require('../util/apiErrors');
const slugify=require('slugify');
//validate MiddelWare
const subCatValidatorMiddelWare=  ((req,res,nxt)=>{
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


const subCatIdVAlidator=check('id').isMongoId().withMessage('Invalid subCat ID Format');

const subCatNameValidator=
        check('name').notEmpty().withMessage("subCat Name Is required")
        .isLength({min:3}).withMessage("Too Short subCat Name")
        .isLength({max:32}).withMessage("Too Long subCat Name")
        .custom((val,{req})=>{
            req.body.slug=slugify(val);
            return true;
        });

const categoryValidator=
        check('category').notEmpty().withMessage("SubCat Must Belong To Cat")
        .isMongoId().withMessage('Invalid Cat ID Format')        

exports.getsubCatValidator   =[subCatIdVAlidator,subCatValidatorMiddelWare];
exports.updatesubCatValidator=[subCatIdVAlidator,subCatValidatorMiddelWare];
exports.deletesubCatValidator=[subCatIdVAlidator,subCatValidatorMiddelWare];
exports.createsubCatValidator=[subCatNameValidator,categoryValidator,subCatValidatorMiddelWare];

