import { Request, Response } from 'express';
import { omit } from 'lodash';
import { createUser } from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
import async from 'async';
export async function searchResultHandler(req: Request, res: Response) {
    const username = req.query.query as any;

    const results = [] as any;

    try {
        const users = await User.find({ username: { $regex: username, $options: 'i' } }).limit(10);
        users.forEach(user => {
            let { _id, username, name } = user;
            results.push({ _id: _id, username: username, name: name });
        });
    } catch (err) {
        console.log(err);
    }
    res.send(JSON.stringify(results));
}

export async function getsearchResultHandler(req: Request, res: Response) {
    const username = req.body.query as any;
    var users = await User.find() as any;
    if (username) {
        const searchUsers = await User.find({ "username": username });
        return res.render("profile.ejs", { users: users, user: req.session.user, searchUsers: searchUsers });

    } else {
        return res.redirect('back');
    }

}



