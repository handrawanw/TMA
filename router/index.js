const Router=require("express").Router();

const User=require("./User");
const Wallet=require("./Wallet");
const Voucher=require("./Voucher");
const ProjectDetail=require("./ProjectDetail");

Router.use("/user",User);
Router.use("/wallet",Wallet);
Router.use("/Voucher",Voucher);
Router.use("/Project",ProjectDetail);

module.exports=Router;