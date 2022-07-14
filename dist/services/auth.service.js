"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const token_model_1 = __importDefault(require("../models/token.model"));
const email_utils_1 = require("./../utils/email.utils");
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const default_1 = __importDefault(require("./../config/default"));
function requestPasswordReset(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findOne({ email });
        if (!user)
            throw new Error("User does not exist");
        const token = yield token_model_1.default.findOne({ userId: user._id });
        if (token)
            yield token.deleteOne();
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const salt = yield bcrypt_1.default.genSalt(default_1.default.saltWorkFactor);
        const hash = yield bcrypt_1.default.hash(resetToken, salt);
        yield new token_model_1.default({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();
        const link = `${default_1.default.host}:${default_1.default.port}/passwordReset/${resetToken}-${user._id}`;
        const status = (0, email_utils_1.sendEmail)(user.email, "Password reset successfully", user.name, link);
        // log.info(status);
        if (status) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.requestPasswordReset = requestPasswordReset;
;
function resetPassword(userId, token, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordResetToken = yield token_model_1.default.findOne({ userId });
        if (!passwordResetToken) {
            throw new Error("Invalid or expired password reset token");
        }
        const isValid = yield bcrypt_1.default.compare(token, passwordResetToken.token);
        if (!isValid) {
            throw new Error("Invalid or expired password reset token");
        }
        const salt = yield bcrypt_1.default.genSalt(default_1.default.saltWorkFactor);
        const hash = yield bcrypt_1.default.hash(password, salt);
        yield user_model_1.default.updateOne({ _id: userId }, { $set: { password: hash } }, { new: true });
        const user = yield user_model_1.default.findById({ _id: userId });
        // sendEmail(
        //   user.email,
        //   "Password Reset Successfully",
        //    user.name,
        //   ,
        //   "./template/resetPassword.handlebars"
        // );
        yield passwordResetToken.deleteOne();
        return true;
    });
}
exports.resetPassword = resetPassword;
;
