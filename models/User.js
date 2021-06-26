const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const User=new Schema({

    email:{
        type:String,
        unique:true,
        required:["Email is required ",true]
    },

    emailVerification:{
        type:Boolean,
        default:false
    },

    password:{
        type:String,
        required:["Password is required ",true]
    },

    role:{
        type:Number,
        default:0
    },

    full_name:{
        type:String,
        required:["Full name is required ",true]
    },   
    
},{
    timestamps:{
        createdAt:"createdAt"
    }
});


const Collection=mongoose.model("User",User);

module.exports=Collection;