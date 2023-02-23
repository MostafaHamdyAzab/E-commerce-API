const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const productSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minLength:[3,"Too Short Product Title"],
        maxLength:[100,"Too Long Product Title"],
    },
    slug:{
        type:String,
        required:true,
        lowercase:true,
    },
    desc:{
        type:String,
        required:[true,"Product Desc Is Required"],
        minLength:[20,"Too Long Product Desc"]
    },
    quantity:{
        type:Number,
        required:[true,"Product Quntity Is Required"]
    },
    sold:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,"Product Price Is Required"],
        trim:true,
        max:[200000,"Too Long Product Price"],
    },
    priceAfterDiscount:{
        type:Number,
    },
    colors:[String],
    images:[String],
    imageCover:{
        type:String,
        required:[true,"Priduct Image cover Is Required"]
    },
    cat:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'Category'
    },
    subCat:[
        {
        type:mongoose.Schema.Types.ObjectID,
        ref:'SubCategory',
        }
    ],
    brand:{
        type:mongoose.Schema.Types.ObjectID,
        ref:'brand'
    },
    ratingsAverage:{
        type:Number,
        min:[1,"Rating Must Be Above Or Equal 1"],
        max:[5,"Rating Must Be Below Or Equal 1"],
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
},{timestamps:true});
productSchema.pre(/^find/,function(nxt){
    this.populate({
        path:'cat',
       select:'name -_id'
    });
    nxt();
})
module.exports=mongoose.model('Product',productSchema);