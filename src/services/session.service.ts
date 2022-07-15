import config from '../config/default';
import { FilterQuery,DocumentDefinition } from 'mongoose';
import Session, { SessionDocument } from "../models/session.model";
import { UserDocument } from "../models/user.model";
import { signJwt, verifyJwt } from '../utils/jwt.utils';
import { get, Omit } from 'lodash';
import log from '../logger';
import { findUser } from './user.service';

export async function createSession(userId:string,userAgent: string) {

        const session = await Session.create({ user: userId,valid:true, userAgent });
        // app.use(sessions({
        //     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        //     saveUninitialized:true,
        //     cookie: { maxAge: oneDay },
        //     resave: false
        // }));
        return session.toJSON();


}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    log.info(query);
    return await Session.find(query).lean();
}

export async function reIssueAccessToken({
    refreshToken,
  }: {
    refreshToken: string;
  }) {
    const decoded = verifyJwt(refreshToken);

    if (!decoded || !get(decoded, "session")) return false;

    const session = await Session.findById(get(decoded, "session"));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = signJwt(
      { ...user, session: session._id },
      { expiresIn: config.accessTokenTtl } // 15 minutes
    );

    return accessToken;
  }