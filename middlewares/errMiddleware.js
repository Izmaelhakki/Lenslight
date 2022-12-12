import express from 'express'; 

const errCatching=(err,req,res,next)=>{
    
    res.json({
        errorcode:err.status,
        message:err.message,
    })
}

export
{
    errCatching
}