const mongoose=require("mongoose");

const dbConnect=()=>{

    const URI="mongodb://localhost:27017/transactions";
    mongoose.connect(URI,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true,useFindAndModify:false,connectTimeoutMS:15000});
    let db=mongoose.connection;
    
    db.on('error',console.log.bind(console,'connection error : '));
    db.once('open',()=>{
        console.log(`Welcome to mongodb`);
    });

}

module.exports=dbConnect;