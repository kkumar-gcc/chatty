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
import { getChatHandler, getRoomHandler } from "../controllers/chat.controller";
import { getHomeHandler } from "../controllers/home.controller";
import { postMessageHandler } from "../controllers/message.controller";
import { searchResultHandler,getsearchResultHandler } from "../controllers/search.controller";
import { friendReqActionHandler, userFriendHandler } from "../controllers/friend.controller";

export default function (app: Application) {

    app.get("/register",loggedIn, (req: Request, res: Response) => {
        res.render("register.ejs");
    });

    app.post("/register",loggedIn,validateRequest(createUserSchema),createUserHandler);

    app.get("/login",loggedIn,(req: Request, res: Response) => {
       
        res.render("login.ejs");
    });
    // app.get("/chat",isLogin,getChatHandler);

    app.post("/login",loggedIn,validateRequest(createUserSessionSchema),createUserSessionHandler)

    app.get("/logout",isLogin,deleteUserSessionsHandler);

    app.get("/home",isLogin,getHomeHandler);
    app.get("/chat/:id",isLogin,getRoomHandler);
    app.post("/chat/:id",isLogin,postMessageHandler);

    app.get("/search",isLogin,searchResultHandler);
    app.post("/search/user",isLogin,getsearchResultHandler);
  
    app.post("/user/request",isLogin,userFriendHandler);
    
    app.post("/user/requestAccept",isLogin,friendReqActionHandler);

    ///testing routes
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