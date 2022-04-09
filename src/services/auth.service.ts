// const JWT = require("jsonwebtoken");
// const User = require("../models/User.model");
// const Token = require("../models/Token.model");
// const sendEmail = require("../utils/email/sendEmail");
// // const crypto = require("crypto");
// const bcrypt = require("bcrypt");

// const requestPasswordReset = async (email:string) => {

//   const user = await User.findOne({ email });

//   if (!user) throw new Error("User does not exist");
//   let token = await Token.findOne({ userId: user._id });
//   if (token) await token.deleteOne();
//   // let resetToken = crypto.randomBytes(32).toString("hex");
//   const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

//   await new Token({
//     userId: user._id,
//     token: hash,
//     createdAt: Date.now(),
//   }).save();

//   const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
//   sendEmail(user.email,"Password Reset Request",{name: user.name,link: link,},"./template/requestResetPassword.handlebars");
//   return link;
// };