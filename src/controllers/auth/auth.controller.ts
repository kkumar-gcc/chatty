import { Request, Response, NextFunction } from 'express';
import log from '../../logger';
import {
    requestPasswordReset,
    resetPassword,
} from "../../services/auth.service";

export async function resetPasswordRequestHandler(req: Request, res: Response, next: NextFunction) {
    return res.render("resetPassword.ejs");
};

export async function newPasswordRequestHandler(req: Request, res: Response, next: NextFunction) {

    const params = req.params.token.split('-');

    const userId = params[1];
    const token = params[0];

    return res.render("newPassword.ejs", { userId, token });
};
export async function resetPasswordResponseHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const requestPasswordResetService = await requestPasswordReset(req.body.email );
        return res.render("resetPassword.ejs", { "success": "successfully sent." });
    } catch (e: any) {
        return res.render("resetPassword.ejs",{"error":e.message});

    }


};

export async function newPasswordResponseHandler(req: Request, res: Response, next: NextFunction) {
    const resetPasswordService = await resetPassword(
        req.body.userId,
        req.body.token,
        req.body.password
    );
    return res.render("login.ejs", { "msg": "password updated successfully" });
};
