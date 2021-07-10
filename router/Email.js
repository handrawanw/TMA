const express=require("express");
const Router=express.Router();

const {
    AuthJwt,AuthRoleUser,
    AuthOtpVerify,
}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

Router.post("/verifyRegister",AuthOtpVerify);

module.exports=Router;