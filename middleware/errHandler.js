const {SearchKeyword}=require("../helpers/errHandlerStore");

module.exports=(err,req,res,next)=>{
    let Message=SearchKeyword(err.message)||"Internal server error";
    console.log(err);

    res.status(500).json({
        message:Message,
        status:500
    });

};