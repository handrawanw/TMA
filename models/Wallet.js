const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Voucher=new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        sparse:true,
        ref:'User'
    },

    active:{
        type:Boolean,
        default:true
    },

    currency_code:{
        type:String,
        default:"IDR"
    },

    currency_country:{
        type:String,
        default:"Indonesia"
    },

    balance:{
        type:Number,
        default:0
    },

},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Collection=mongoose.model("Wallet",Voucher);

Collection.createIndexes({user:-1});

module.exports=Collection;