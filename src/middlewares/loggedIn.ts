

import { Request,Response,NextFunction} from "express";
import { get } from "lodash";
import log from "../logger";
import { verifyJwt } from "../utils/jwt.utils";

const loggedIn= async (req:Request,res:Response,next:NextFunction)=>{

    if (!req.session.user) {
        next();
      } else {
       return res.redirect("/home");
      }
}

export default loggedIn;