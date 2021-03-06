const Router=require("express").Router();

const User=require("./User");
const Wallet=require("./Wallet");
const Voucher=require("./Voucher");
const ProjectDetail=require("./ProjectDetail");
const Project=require("./Project");
const Email=require("./Email");
const Tx=require("./Order");

Router.use("/user",User);
Router.use("/wallet",Wallet);
Router.use("/Voucher",Voucher);
Router.use("/Project",ProjectDetail);
Router.use("/LEP",Project);
Router.use("/Email",Email);
Router.use("/Tx",Tx);

module.exports=Router;