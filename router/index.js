const Router=require("express").Router();

const User=require("./User");
const Wallet=require("./Wallet");
const Voucher=require("./Voucher");
const ProjectDetail=require("./ProjectDetail");
const Project=require("./Project");

Router.use("/user",User);
Router.use("/wallet",Wallet);
Router.use("/Voucher",Voucher);
Router.use("/Project",ProjectDetail);
Router.use("/LEP",Project);

module.exports=Router;