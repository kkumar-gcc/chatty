import { Request, Response, Application } from "express";
import { createUserHandler} from "../controllers/user.controller";
import validateRequest from '../middlewares/validateRequest';
import { createUserSchema} from "../schema/user.schema";

export default function (app: Application) {

    app.get("/healthcheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    app.post("/api/users",validateRequest(createUserSchema),createUserHandler);


    // app.post("/api/sessions",validateRequest(createUserSessionSchema),createUserSessionHandler)




    //Register user
    // Post /api/user


    //Login
    //POST /api/session

    //Get the user's sessions
    //GET /api/sessions

    //Logout
    //DELETE /api/sessions

}