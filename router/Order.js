const express=require("express");
const Router=express.Router();

const {AuthJwt}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {createAccount,Orders}=require("../controller/Tx");

Router.post("/create",AuthJwt,createAccount);

Router.post("/Order",AuthJwt,validate("order"),viewValidateError,Orders);

module.exports=Router;