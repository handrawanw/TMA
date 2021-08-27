const mongoose = require("mongoose");

const Schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    currency:{
        type:String,
        required:["currency harus di isi",true]
    },
    balance:{
        type:Number,
        default:1e+5
    },
    frozen_balance:{
        type:Number,
        default:0
    },
    address:{
        type:String,
        default:null
    },
    keyPair:{
        type:Object,
        default:null
    },
    memo:{
        type:String,
        default:null
    },
    seed:{
        type:String,
        default:null
    },
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

module.exports=mongoose.model("Account",Schema);
