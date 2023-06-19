const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const brandSchema=new Schema({
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
},{timestamps:true});

const setIamgeUrl=(doc)=>{
    if(doc.image){
        const imageUrl=`${process.env.BASE_URL}/cats/${doc.image}`;
        doc.image=imageUrl;
        }
};

brandSchema.post('init', function(doc) { //this call after doc is intialized in db 'call in select'
    setIamgeUrl(doc);
  });

brandSchema.post('save', function(doc) {
    setIamgeUrl(doc);
  });
const Brand=mongoose.model('brand',brandSchema);
module.exports=Brand;