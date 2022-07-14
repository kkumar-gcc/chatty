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
const token_model_1 = __importDefault(require("../models/token.model"));
const isToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.params.token.split('-');
    const userId = params[1];
    // const token = params[0];
    const passwordResetToken = yield token_model_1.default.find({ "userId": userId });
    if (!passwordResetToken) {
        return res.render("resetPassword.ejs", { "error": "Invalid or expired password reset link" });
    }
    return next();
});
exports.default = isToken;
