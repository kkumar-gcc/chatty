import { Request, Response, Application } from "express";
import { createUserHandler, getUserDetailHandler, getUserHandler } from "../controllers/user.controller";
import { createUserSessionHandler, deleteUserSessionsHandler, getUserSessionsHandler } from "../controllers/session.controller";

import validateRequest from '../middlewares/validateRequest';
import { createUserSchema, createUserSessionSchema } from "../schema/user.schema";
import requireUser from "../middlewares/requireUser";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import log from "../logger";
import flash from "connect-flash";
import isLogin from "../middlewares/isLogin";
import loggedIn from "../middlewares/loggedIn";
import { getChatHandler, getRoomHandler } from "../controllers/chat.controller";
import { getHomeHandler } from "../controllers/home.controller";
import { postMessageHandler } from "../controllers/message.controller";
import { searchResultHandler, getsearchResultHandler, searchUserResultHandler } from "../controllers/search.controller";
import { friendReqActionHandler, getChatFriendHandler, userFriendHandler, userFriendRequestsHandler } from "../controllers/friend.controller";
import isFriend from "../middlewares/isFriend";
import { newPasswordRequestHandler, newPasswordResponseHandler, resetPasswordRequestHandler, resetPasswordResponseHandler } from "../controllers/auth/auth.controller";
import isToken from "../middlewares/isToken";
import { getNotificationHandler } from "../controllers/notification.controller";

export default function (app: Application) {

    app.get("/register", loggedIn, (req: Request, res: Response) => {
        res.render("register.ejs");
    });

    app.post("/register", loggedIn, validateRequest(createUserSchema), createUserHandler);

    app.get("/login", loggedIn, (req: Request, res: Response) => {

        res.render("login.ejs");
    });
    // app.get("/chat",isLogin,getChatHandler);

    app.post("/login", loggedIn, validateRequest(createUserSessionSchema), createUserSessionHandler)
    app.get("/logout", isLogin, deleteUserSessionsHandler);

    app.get("/home", isLogin, getHomeHandler);
    app.get("/chat", isLogin, getChatFriendHandler);
    app.get("/chat/:id", isLogin, isFriend, getRoomHandler);
    app.post("/chat/:id", isLogin, isFriend, postMessageHandler);

    app.get("/search", isLogin, searchResultHandler);
    app.get("/searchUser", isLogin, searchUserResultHandler);
    app.post("/search", isLogin, getsearchResultHandler);

    app.post("/user/request", isLogin, userFriendHandler);

    app.post("/user/requestAccept", isLogin, friendReqActionHandler);
    app.post("/profile/update", isLogin, getUserHandler);
    app.get("/passwordReset", loggedIn, resetPasswordRequestHandler);
    app.post("/passwordReset", loggedIn, resetPasswordResponseHandler);
    app.get("/passwordReset/:token", loggedIn, isToken, newPasswordRequestHandler);
    app.post("/passwordReset/:token", loggedIn, isToken, newPasswordResponseHandler);
    app.get("/chatrequests", isLogin, userFriendRequestsHandler);
    app.put("/user-detail", isLogin, getUserDetailHandler);
    app.get("/notifications", isLogin, getNotificationHandler);
    /// testing routes /profile/update

    app.get("/verify", async (req: Request, res: Response) => {

        const jwtToken = signJwt({
            username: "krishan"
        });
        log.info(jwtToken);
        const { decoded, expired, valid } = await verifyJwt(jwtToken);
        log.info(decoded);
    })
    app.get("/new", (req: Request, res: Response) => {
        res.render("index.ejs");
    });

    app.get("/api/sessions", requireUser, getUserSessionsHandler);

    //

}