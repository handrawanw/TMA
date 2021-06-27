// const totp=require("totp-generator");

// const token=totp("HANDRAWAN",{
// 	digits: 6,
// 	algorithm: "SHA-512",
// 	period: 60,
// })
// console.log(token);

const {VoucherRandom}=require("./helpers/utils");

console.log(VoucherRandom());

// for(let i=1;i<=30;i++){
//     console.log(i,"=",i%7);
// }