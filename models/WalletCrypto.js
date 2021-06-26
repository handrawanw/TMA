const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const WalletModel=new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    address:{
        type:String,
        default:null,
    },

    balance:{
        type:Number,
        default:0
    },

    currency_symbol:{
        type:String,
        required:["Currency symbol is required ",true]
    },

    keyPair:{
        type:Object,
        default:null
    },

    memo:{
        type:String,
        default:null
    }


},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Collection=mongoose.model("WalletCrypto",WalletModel);

module.exports=Collection;