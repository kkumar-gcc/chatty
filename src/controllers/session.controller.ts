import { Request, Response,NextFunction } from 'express';
import { validatePassword } from '../services/user.service';
import log from '../logger';
import { createSession, findSessions } from '../services/session.service';
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import config from '../config/default';
import Session from '../models/session.model';
import User from '../models/user.model';
export async function createUserSessionHandler(req: Request, res: Response) {
    const user = await validatePassword(req.body);

    if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
    }
    const session = await createSession(user._id, req.get("user-agent") || "");

    const accessToken = signJwt(
        {  ...user, session: session._id },
        { expiresIn: config.accessTokenTtl }
    );

    const {decoded,expired,valid}= await verifyJwt(accessToken) ;

    if(decoded){
        req.session.user=decoded;
    }

    res.cookie("accessToken",accessToken,{
        maxAge:30000,
        httpOnly:true,
    })

    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: config.accessTokenTtl }
    );
   return res.redirect("/home");

}

export async function getUserSessionsHandler(req: Request, res: Response) {

    const  user = req.session.user as any;

    const sessions = await findSessions({ user: user.id, valid: true });

    return res.send(sessions);
}

export async function deleteUserSessionsHandler(req: Request, res: Response) {
    const user = req.session.user as any;

    if (req.session) {
       await Session.deleteMany({ "user" :Object( user._id)});
        req.session.destroy(err => {
          if (err) {
            res.status(400).send('Unable to log out')
          } else {
            return res.redirect("/login");
          }
        });
      } else {
        res.end()
      }

}


