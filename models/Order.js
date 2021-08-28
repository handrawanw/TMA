const mongoose = require("mongoose");

const Schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    base:{
        type:String,
        required:["base harus di isi",true]
    },
    quote:{
        type:String,
        required:["quote harus di isi",true]
    },
    type:{
        type:String,
        required:["type harus di isi",true]
    },
    side:{
        type:String,
        required:["side harus di isi",true]
    },
    price:{
        type:Number,
        required:["price harus di isi",true]
    },
    amount:{
        type:Number,
        required:["amount harus di isi",true]
    }
},{
    timestamps:{
        createdAt:"createdAt"
    }
});

const Order=mongoose.model("Order",Schema);

Order.createIndexes({price:-1})

module.exports=Order;