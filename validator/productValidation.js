const {check,validationResult}=require('express-validator');
const ApiError = require('../util/apiErrors');
const catModel=require('../Models/categoryModel');
const subCatModel=require('../Models/subCategoryModel');
const slugify=require('slugify');
//validate MiddelWare
const productValidatorMiddelWare=  ((req,res,nxt)=>{
    const errors=validationResult(req);
    // // console.log(errors.array()[0].msg)
    if(!errors.isEmpty()){
        return res.status(400).json({err:errors.array()})
        // return nxt(new ApiError("",process.env.MSG,400));
    }
        nxt();
    
    });


const productIdVAlidator=check('id').isMongoId().withMessage('Invalid Product ID Format');

const productTitleValidator=
        check('title').notEmpty().withMessage("Product Title Is required")
        .isLength({min:3}).withMessage("Too Short Title Name")
        .isLength({max:100}).withMessage("Too Long Title Name")
        .custom((val,{req})=>{
                req.body.slug=slugify(val);
                return true;
        });  

const productDescValidator=
        check('desc').notEmpty().withMessage("Product Description Is required")
        .isLength({min:20}).withMessage("Too Short Product Description");

const productQuantityValidator=
        check('quantity').isNumeric().withMessage("Product Quantity Must Be Numeric")
        .notEmpty().withMessage("Product Quantity Is required");

const productPriceValidator=
        check('price').isNumeric().withMessage("Product Price Must Be Numeric")
        .toFloat().notEmpty().withMessage("Product Price Is required")
        .isLength({max:10}).withMessage("Too Long Product Price")
       

const productPriceAfterDiscountValidator=
        check('priceAfterDiscount').isNumeric().withMessage("Product Price Must Be Numeric")
        .notEmpty().withMessage("Product Price Is required")
        .isLength({max:10}).withMessage("Too Long Product Price")
        .custom((value,{req})=>{
                if(req.body.price<=value){
                    throw new ApiError("","Price After Discount Must Less Than Real Price",400);
                }
                return true;
            });

const productCategoryValidator=
        check('cat').isMongoId().withMessage("Product MustBe Included To Category")
        .custom((value)=>
           catModel.findById(value)
             .then((cat)=>{
                if(!cat){
                //    Promise.reject("No Category For Tis Id");
                throw new ApiError("","Cat Not Fond",400);
                        }
                })
        );

const productSubCat=
         check('subCat').optional().isMongoId().withMessage("Invalid catId Format ")
         .custom((values)=>
            subCatModel.find({_id:{$exists:true,$in:values} })
              .then((result)=>{
                        // console.log(result.length,values.length);
                        if(result.length!== values.length){
                        // Promise.reject(new ApiError("","Invalid subCat",400));
                        throw new ApiError("","subCat Not Fond",400);
                        }
                      })
                ).custom((values,{req})=>
                subCatModel.find({category:req.body.cat})
                .then((subCats)=>{
                        const subCatsIDs=[];//subCatsId in Db
                        subCats.forEach(subCat=>{
                        subCatsIDs.push(subCat._id.toString());
                        });
                 const checker=(target,arr)=> target.every((val)=>arr.includes(val))      
                if(!checker(values,subCatsIDs)){
                        throw new ApiError("","Sorry subCat Not Include To Cat",400);  
                }
                
                })
                );

const productBrandValidator=
        check('brand').isMongoId().withMessage("Product MustBe Included To Brand").optional();

const productColorsValidator=
        check('colors').isArray().withMessage("Product Colors Must Be Array").optional();

const productImagesValidator=
        check('images').isArray().withMessage("Product Images Must Be Array").optional();

const productImageCoverValidator=
        check('imageCover').notEmpty().withMessage("Product Image Cover Is Required");

const productRatingAverageValidator=
        check('ratingsAverage').isNumeric().withMessage("Product ratingAverge Must Be").optional()
        .isLength({min:1}).withMessage("RatingAverage Above Or equal 1.0")
        .isLength({max:5}).withMessage("RatingAverage Below Or equal 5.0")

const productRatingQuantityValidator=
        check('ratingsQuantity').optional().isNumeric().withMessage("Rating Quantity Mus Be Number");
        

const createCredintatials=[
    productRatingQuantityValidator,
    productRatingAverageValidator,
    productImagesValidator,
    productImageCoverValidator,
    productColorsValidator,
    productBrandValidator,
    productCategoryValidator,
    productSubCat,
    productPriceAfterDiscountValidator,
    productPriceValidator,
    productQuantityValidator,
    productDescValidator,
    productTitleValidator,
]




exports.getProductValidator=[productIdVAlidator,productValidatorMiddelWare];
exports.updateProductValidator =[productIdVAlidator,productValidatorMiddelWare];
exports.deleteProductValidator =[productIdVAlidator,productValidatorMiddelWare];
exports.createProductValidator =[createCredintatials,productValidatorMiddelWare];

