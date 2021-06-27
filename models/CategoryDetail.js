const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Project=new Schema({

    project_name:{
        type:String,
        required:["Project name harus di isi",true]
    },

    status_active:{
        type:Boolean,
        default:true
    },
    
    category:{
        type:String,
        uppercase:true,
        default:"SMALL"
    },

    profit_interest:{
        type:Number,
        default:0
    },

    profit_interest_week:{
        type:Number,
        default:0
    },

    min_balance:{
        type:Number,
        default:0
    },

    max_balance:{
        type:Number,
        default:0
    },

    session_time:{
        type:Number,
        default:0
    }
    
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Collection=mongoose.model("CategoryProject",Project);

module.exports=Collection;