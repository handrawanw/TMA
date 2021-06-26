const Router=require("express").Router();

const User=require("./User");

Router.use("/user",User);

module.exports=Router;