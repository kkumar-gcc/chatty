

import { Request,Response,NextFunction} from "express";
import { get } from "lodash";
import log from "../logger";
import { verifyJwt } from "../utils/jwt.utils";
import Token from '../models/token.model';

const isToken= async (req:Request,res:Response,next:NextFunction)=>{

    const params = req.params.token.split('-');

    const userId = params[1];
    // const token = params[0];
    const passwordResetToken = await Token.find({"userId":userId});

if (!passwordResetToken) {
  return res.render("resetPassword.ejs", { "error": "Invalid or expired password reset link" });
}
return next();

}

export default isToken;