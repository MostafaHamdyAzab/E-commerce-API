const globalError = (err, req, res, nxt) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    if(process.env.MODE=="dev"){
        sendErrForDev(err,res)
    }else if(process.env.MODE=="prod"){
        sendErrForProduction(err,res);
    }
 
};
const sendErrForDev=(err,res)=>{
    res.status(err.statusCode).json({
        gMes: err.gMes,//this if url is error
        status: err.status,
        msg: err.message,
        error: err,
        stack: err.stack,
    });
}

const sendErrForProduction=(err,res)=>{
    res.status(err.statusCode).json({
        gMes: err.gMes,//this if url is error
        status: err.status,
        msg: err.message,
    });
}

module.exports = globalError;