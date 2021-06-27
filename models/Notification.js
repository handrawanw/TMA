const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Notification=new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    tx_status:{
        type:String,
        default:"Success"
    },

    title:{
        type:String,
        required:["Title notification dibutuhkan",true]
    },

    description:{
        type:String,
        default:""
    },   
    
},{
    timestamps:{
        createdAt:"createdAt"
    }
});


const Collection=mongoose.model("Notification",Notification);

module.exports=Collection;