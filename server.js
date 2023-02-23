const express=require('express');
const app=express();
const db=require('./config/db');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
const morgan=require('morgan');
const catRoute=require("./Routes/catRoute");
const subCatRoute=require("./Routes/subCatRoute");
const brandRoute=require("./Routes/brandRoute");
const productRoute=require("./Routes/productRoute");
const asyncHandler=require('express-async-handler');
const ApiError=require("./util/apiErrors");
const globalError=require('./middelwares/errors')
// app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());
dotenv.config({path:"config.env"});
app.use(morgan('dev'));
app.use('/api/cat',   catRoute);
app.use('/api/subcat',subCatRoute);
app.use('/api/brand', brandRoute);
app.use('/api/product', productRoute);

app.all('*',(req,res,nxt)=>{
   nxt(new ApiError(`cant find Route ${req.originalUrl}`,process.env.MSG,400));
});

app.use(globalError);       //this For All Express Errors

const server=app.listen(process.env.PORT,()=>{
    console.log("App LOading..");
    console.log(`Running On Port ${process.env.port}`)
});

//this for errors out express as dbconn err or 
process.on('unhandledRejection',(err)=>{
    console.error(`unhandledRejection ${err.name}|${err.message}`);
    server.close(()=>{//if any process is run first terminate it and then exit
        process.exit(1);
    })
    

})


