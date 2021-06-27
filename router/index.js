const Router=require("express").Router();

const User=require("./User");
const Wallet=require("./Wallet");
const Voucher=require("./Voucher");

Router.use("/user",User);
Router.use("/wallet",Wallet);
Router.use("/Voucher",Voucher);

module.exports=Router;