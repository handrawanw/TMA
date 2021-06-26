const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const Voucher=new Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        sparse:true,
        ref:'User'
    },

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        sparse:true,
        ref:'User'
    },

    code_voucher_idx:{
        type:String,
        unique:true,
        required:["Kode Voucher Indodax diperlukan ",true]
    },

    vouchers_received:{
        type:String,
        default:"Pending"
    },

    saldo:{
        type:Number,
        default:0
    },

    description:{
        type:String,
        default:""
    },

    reason:{
        type:String,
        default:""
    }
    
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Collection=mongoose.model("Voucher",Voucher);

Collection.createIndexes({sender:-1,receiver:-1});

module.exports=Collection;