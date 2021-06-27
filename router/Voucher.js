const express=require("express");
const Router=express.Router();

const {AuthJwt,AuthRoleAdmin}=require("../middleware/Auth");
const {validate,viewValidateError}=require("../middleware/validate");

const {depositVoucher,depositSender,konfirmasiVoucher,topUpBalance,withdrawReceiver,withdrawVoucher}=require("../controller/TopUp");

Router.post("/valid",AuthJwt,validate("voucherValid"),viewValidateError,konfirmasiVoucher);

Router.post("/deposit",AuthJwt,validate("createVoucher"),viewValidateError,depositVoucher);
Router.get("/deposit",AuthJwt,depositSender);
Router.post("/withdraw",AuthJwt,validate("withdrawVoucher"),viewValidateError,withdrawVoucher);
Router.get("/withdraw",AuthJwt,withdrawReceiver);

Router.post("/cairkan",AuthJwt,AuthRoleAdmin,validate("cairkanVoucher"),viewValidateError,topUpBalance);

module.exports=Router;
