const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Project=new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        sparse:true,
        ref:'User'
    },

    detail_project:{
        type:mongoose.Schema.Types.ObjectId,
        sparse:true,
        ref:"CategoryProject"
    },

    collected:{
        type:Number,
        default:0
    },

    progress:{
        type:String,
        sparse:true,
        default:"Pending"
    },

    frozen_balance:{
        type:Number,
        min:1e+4
    },

    session_remaining:{
        type:Number,
        default:Date.now()
    },

    expired:{
        type:Number,
        default:Date.now()
    }
    
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Collection=mongoose.model("Project",Project);

Collection.createIndexes({user:-1,category_project:-1});

module.exports=Collection;