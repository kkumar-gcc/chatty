import { Request,NextFunction, Response } from "express";
import log from "../logger";

const requireUser=(req:Request,res:Response,next:NextFunction)=>{
  const user =req.session.user;
  if(!user){
    req.flash("error", "Please login first");
    return res.redirect("/login");
  }
  return next();
}

export default requireUser;