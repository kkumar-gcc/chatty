

import { Request,Response,NextFunction} from "express";
import { get } from "lodash";
import log from "../logger";
import { verifyJwt } from "../utils/jwt.utils";

const isLogin= async (req:Request,res:Response,next:NextFunction)=>{

    if (req?.session?.user) {
        next();
      } else {
       req.flash("error", "Please login first");
       return res.redirect("/login");
      }
}

export default isLogin;