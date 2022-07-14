import JWT from "jsonwebtoken";
import User from "../models/user.model";
import Token from "../models/token.model";
import { sendEmail } from "./../utils/email.utils";
import crypto from "crypto";
import bcrypt from "bcrypt";
import log from "../logger";
import config from "./../config/default";

export async function requestPasswordReset(email: any) {

  const user = await User.findOne({ email });

  if (!user) throw new Error("User does not exist");
  const token = await Token.findOne({ userId: user._id });
  if (token) await token.deleteOne();
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = await bcrypt.genSalt(config.saltWorkFactor);
  const hash = await bcrypt.hash(resetToken, salt);

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${config.host}:${config.port}/passwordReset/${resetToken}-${user._id}`;

  const status = sendEmail(user.email, "Password reset successfully", user.name, link) as any;
  // log.info(status);
  if (status) {
    return true;
  }
  else {
    return false;
  }
};
export async function resetPassword(userId: any, token: any, password: any) {
  const passwordResetToken = await Token.findOne({ userId });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  const salt = await bcrypt.genSalt(config.saltWorkFactor);
  const hash = await bcrypt.hash(password, salt);
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  // sendEmail(
  //   user.email,
  //   "Password Reset Successfully",
  //    user.name,
  //   ,
  //   "./template/resetPassword.handlebars"
  // );
  await passwordResetToken.deleteOne();
  return true;
};