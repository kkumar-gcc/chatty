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
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordResponseHandler = exports.resetPasswordResponseHandler = exports.newPasswordRequestHandler = exports.resetPasswordRequestHandler = void 0;
const auth_service_1 = require("../../services/auth.service");
function resetPasswordRequestHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.render("resetPassword.ejs");
    });
}
exports.resetPasswordRequestHandler = resetPasswordRequestHandler;
;
function newPasswordRequestHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = req.params.token.split('-');
        const userId = params[1];
        const token = params[0];
        return res.render("newPassword.ejs", { userId, token });
    });
}
exports.newPasswordRequestHandler = newPasswordRequestHandler;
;
function resetPasswordResponseHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestPasswordResetService = yield (0, auth_service_1.requestPasswordReset)(req.body.email);
            return res.render("resetPassword.ejs", { "success": "successfully sent." });
        }
        catch (e) {
            return res.render("resetPassword.ejs", { "error": e.message });
        }
    });
}
exports.resetPasswordResponseHandler = resetPasswordResponseHandler;
;
function newPasswordResponseHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const resetPasswordService = yield (0, auth_service_1.resetPassword)(req.body.userId, req.body.token, req.body.password);
        return res.render("login.ejs", { "msg": "password updated successfully" });
    });
}
exports.newPasswordResponseHandler = newPasswordResponseHandler;
;
