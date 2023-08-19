
import { Request,Response,NextFunction} from "express";
import { get } from "lodash";
import log from "../logger";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser= async (req:Request,res:Response,next:NextFunction)=>{
    const accessToken=get(req,"headers.authorization","").replace(/^Bearer\s/,"");
     const {decoded,expired,valid}= await verifyJwt(accessToken) ;
    if(!accessToken){
        return next();
    }
    if(decoded){
        if(req.session){
            req.session.user=decoded;
        }
        next();
    }
    return next();
}

export default deserializeUser;