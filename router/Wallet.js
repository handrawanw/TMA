const express=require("express");
const Router=express.Router();

const {AuthJwt,AuthRoleUser}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {getOneWallet}=require("../controller/Wallet");

Router.get("/one/:id_wallet",AuthJwt,AuthRoleUser,validate("walletOne"),viewValidateError,getOneWallet);

module.exports=Router;