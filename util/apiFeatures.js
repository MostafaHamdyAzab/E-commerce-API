class ApiFeatures{
    constructor(mongooseQuery,queryString){
        this.mongooseQuery=mongooseQuery;//productModel.find()
        this.queryString=queryString;//req.query
    }

    filter(){
        const queryStringObj={...this.queryString};//copy of req
        const excludeFields=['page','sort','limit','fields','keyWord'];//i use all thes prop in another methods
        excludeFields.forEach((field)=> delete queryStringObj[field]);
        //this for add $   -- to use >,< in query
        let queryStr=JSON.stringify(queryStringObj);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match)=>`$${match}`);
        this.mongooseQuery= this.mongooseQuery.find(JSON.parse(queryStr));
        return this;
    }


    sort(){
        if(this.queryString.sort){
            const sortBy= this.queryString.sort.split(',').join(' ');//exclude , from query
            this.mongooseQuery=this.mongooseQuery.sort(sortBy);
         }else{
            this.mongooseQuery=this.mongooseQuery.sort('-createdAt');
         };
      return this;
    };


    limitFields(){
        if( this.queryString.fields){
            // console.log(req.query.fields);
            const fields= this.queryString.fields.split(',').join(' ');
            this.mongooseQuery= this.mongooseQuery.select(fields);
         }else{
            this.mongooseQuery= this.mongooseQuery.select('-__v');
         }
         return this;
    };

    paginate(Documents){
        const page=this.queryString.page*1||1;
        const limit=this.queryString.limit*1||3;
        const skip=(page-1)*limit;
        let lastDocument=page*limit; //last document get
        this.mongooseQuery=this.mongooseQuery
        .skip(skip).limit(limit)
        // .populate({path:"cat",select:'name -_id'}); //not populate in brands

        let pagination={};
        pagination.page=page;
        pagination.limit=limit;
        pagination.NofPages=Math.ceil(Documents/limit);

        if(lastDocument<Documents){
            pagination.nextPage=page+1; 
        }
        if(skip>0){
            pagination.prevPage=page-1;
        }
        this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult=pagination;
        return this;
    };

    search(modelName){
        if(modelName=='Products'){
            if( this.queryString.keyWord){
                 this.mongooseQuery=this.mongooseQuery.or([
                    {title:{$regex:this.queryString.keyWord,$options:'i'}},
                    {desc:{$regex:this.queryString.keyWord,$options:'i'}}
                ]);
                    }
        }
       
     
        return this;
    }

};

module.exports=ApiFeatures;