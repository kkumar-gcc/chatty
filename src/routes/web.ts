import { Request, Response, Application } from "express";
import { createUserHandler} from "../controllers/user.controller";
import { createUserSessionHandler, deleteUserSessionsHandler, getUserSessionsHandler} from "../controllers/session.controller";

import validateRequest from '../middlewares/validateRequest';
import { createUserSchema,createUserSessionSchema} from "../schema/user.schema";
import requireUser from "../middlewares/requireUser";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import log from "../logger";
import flash from "connect-flash";
import isLogin from "../middlewares/isLogin";
import loggedIn from "../middlewares/loggedIn";

export default function (app: Application) {

    app.get("/register",loggedIn, (req: Request, res: Response) => {
        res.render("register.ejs");

    });

    app.post("/register",loggedIn,validateRequest(createUserSchema),createUserHandler);

    app.get("/login",loggedIn,(req: Request, res: Response) => {
       
        res.render("login.ejs");
    });
    app.post("/login",loggedIn,validateRequest(createUserSessionSchema),createUserSessionHandler)

    app.get("/logout",isLogin,deleteUserSessionsHandler);

    app.get("/home",isLogin,(req: Request, res: Response) => {
        res.render("home.ejs",{user:req.session.user});
    });


  
    //just for debugging

    app.get("/verify",async (req: Request, res: Response) => {

       const jwtToken= signJwt({
            username:"krishan"
        });
        log.info(jwtToken);
        const {decoded,expired,valid}= await verifyJwt(jwtToken);
        log.info(decoded);
    })
    app.get("/new",(req:Request, res:Response)=>{
        res.render("index.ejs");
    });

    app.get("/api/sessions",requireUser,getUserSessionsHandler);

    //

}