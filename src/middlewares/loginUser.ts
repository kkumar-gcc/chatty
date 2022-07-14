
// import { Request,Response,NextFunction} from "express";
// import { get } from "lodash";
// import log from "../logger";
// import { verifyJwt } from "../utils/jwt.utils";

// const loginUser = async (req:Request,res:Response,next:NextFunction)=>{
//     const accessToken=get(req,"headers.authorization","").replace(/^Bearer\s/,"");
//      const {decoded,expired,valid}= await verifyJwt(accessToken) ;
//     log.info(accessToken,decoded);
//      if(!decoded){
//         return res.render("login.ejs");
//     }
//     res.locals.user=decoded;
//     return next();
// }

// export default loginUser;