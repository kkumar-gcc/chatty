import {Request,Response} from 'express';
import { omit } from 'lodash';
import {createUser} from '../services/user.service';
import log from '../logger';
export async function createUserHandler(req:Request,res:Response) {
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

