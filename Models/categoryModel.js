const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const categorySchema=new Schema({
    name:{
        type: String,
        unique: [true,"Category Must be Unique"],
       minLength:[3,"Too Samll Length"],
       maxLength:[32,"Too Large Length"],
    },
    slug:{
        type:String,
        lowerCase:true
    },
    image:String
},{timestamps:true})
const Category=mongoose.model('Category',categorySchema);
module.exports=Category;