import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser, findUser } from '../services/user.service';
import log from '../logger';
import ejs from "ejs";
import User from '../models/user.model';
export async function createUserHandler(req: Request, res: Response) {
    const olduser = await User.find({ "$or": [{ "email": req.body.email }, { "username": { $regex: req.body.username, $options: 'i' } }] }) as any;
    if (olduser && olduser.length > 0) {
        req.flash("uniError", "username or email already exits");
        return res.redirect("back");
    }
    try {
        const user = await createUser(req.body);
        return res.render("login.ejs", { success: "account successfully created" });
    } catch (e: any) {
        if (e.name === "ValidationError") {
            const errors = {} as any;

            e.inner.forEach((x: any) => {
                if (x.path !== undefined) {
                    const z = (x.path).slice(5);
                    errors[z] = x.errors;
                }
            });
            return res.redirect("/register");
        }
        return res.status(500).send("Something went wrong");;
    }
}
export async function getUserHandler(req: Request, res: Response) {
    const user = req.session.user as any;
    User.findOneAndUpdate({ _id: user._id }, { name: req.body.name, description: req.body.description }, { new: true }, (err: any, doc: any) => {
        return res.redirect("/home");
    });
}
export async function getUserDetailHandler(req: Request, res: Response) {
    const id = req.body.userId as string;
    const user = await User.find({ "_id": id }).select(["-password", "-friends"]).exec() as any;
    await ejs.renderFile(__dirname + "/../views/popover.ejs", { user: user[0] },(err, data) => {
        if(err){
            log.error(err);
        }
        return res.json(data);
    });

}




