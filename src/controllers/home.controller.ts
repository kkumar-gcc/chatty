import {Request,Response} from 'express';
import { omit } from 'lodash';
import {createUser} from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
export async function getHomeHandler(req:Request,res:Response) {
    const users = await User.find();
    return res.render("home.ejs",{users: users,user:req.session.user});
}

