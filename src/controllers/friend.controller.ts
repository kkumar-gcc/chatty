import {Request,Response} from 'express';
import { omit } from 'lodash';
import {createUser} from '../services/user.service';
import log from '../logger';
import User from '../models/user.model';
import Friend from '../models/friend.model';
export async function userFriendHandler(req:Request,res:Response) {
    const user = req.session.user as any;

    const docA = await Friend.findOneAndUpdate(
        { requester: Object(user._id), recipient: Object(req.body.recipientId)},
        { $set: { status: 1 }},
        { upsert: true, new: true }
    );

    const docB = await Friend.findOneAndUpdate(
        { recipient:Object(user._id), requester: Object(req.body.recipientId) },
        { $set: { status: 2 }},
        { upsert: true, new: true }
    );

    const updateUserA = await User.findOneAndUpdate(
        { _id: Object(user._id) },
        { $push: { pendings: Object(docA._id)}}
    );

    const updateUserB = await User.findOneAndUpdate(
        { _id: Object(req.body.recipientId) },
        { $push: { pendings: Object(docB._id) }}
    );

    return res.redirect('/home');
}

export async function friendReqActionHandler(req:Request,res:Response) {
    const user = req.session.user as any;

    if(req.body.action=="Accept"){
        Friend.findOneAndUpdate(
            { requester: Object(user._id), recipient: Object(req.body.recipientId) },
            { $set: { status: 3 }}
        )
        Friend.findOneAndUpdate(
            { recipient: Object(user._id), requester: Object(req.body.recipientId)},
            { $set: { status: 3 }}
        )
    }
    else{
        const docA = await Friend.findOneAndRemove(
            { requester: Object(user._id), recipient: Object(req.body.recipientId) }
        )
        const docB = await Friend.findOneAndRemove(
            { recipient:Object(user._id), requester: Object(req.body.recipientId) }
        )
        const updateUserA = await User.findOneAndUpdate(
            { _id: Object(user._id) },
            { $pull: { pendings: Object(docA._id) }}
        )
        const updateUserB = await User.findOneAndUpdate(
            { _id: Object(req.body.recipientId) },
            { $pull: { pendings: Object(docB._id) }}
        )
    }
}