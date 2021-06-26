const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Project=new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        sparse:true,
        ref:'User'
    },

    project_name:{
        type:String,
        required:["Project name harus di isi",true]
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

    expired:{
        type:Date,
        default:Date.now()
    }
    
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Collection=mongoose.model("Project",Project);

Collection.createIndexes({user:-1,progress:-1});

module.exports=Collection;