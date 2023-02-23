const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const subCategorySchema=new Schema({
    name:{
        type:String,
        trim:true,
        unique:[true,"Name Must Be Unique"],
        minLength:[3,"Too Shot Name"],
        maxLength:[32,"Too Long Name"]
    },
    slug:{
        type:String,
        lowercase:true,
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:"Category",
        required:[true,"sun Cat Must Be belong To Parent Category"],

    }
},{TimeStamps:true});

module.exports=mongoose.model('SubCategory',subCategorySchema);
