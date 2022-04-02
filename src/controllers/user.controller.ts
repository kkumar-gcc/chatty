import {Request,Response} from 'express';
import { omit } from 'lodash';
import {createUser} from '../services/user.service';
import log from '../logger';
import mongoose from 'mongoose';
import User from '../models/user.model';
export async function createUserHandler(req:Request,res:Response) {
    const  olduser= await User.find({ "$or": [{"email":req.body.email}, { "username": { $regex: req.body.username, $options: 'i' } }] }) as any;
       
    if(olduser && olduser.length >0){
        req.flash("uniError","username or email already exits");
         return res.redirect("back");
    }
    try{
      
       const user = await createUser(req.body);
        return res.render("login.ejs",{success:"account successfully created"});

    }catch(e:any){
        if (e.name === "ValidationError") {
            let errors = {} as any;
            
             e.inner.forEach((x: any) => {
                 if (x.path !== undefined) {
                   var  z =(x.path).slice(5);
                     errors[z] = x.errors;
                 }
             });
         
            return res.redirect("/register");
          }
          
        return res.status(500).send("Something went wrong");;
       
    }
}

