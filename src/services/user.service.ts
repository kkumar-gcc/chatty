import { omit } from 'lodash';
import { DocumentDefinition } from 'mongoose';
import log from '../logger';
import { FilterQuery } from "mongoose";
import User, { UserDocument } from "../models/user.model";

export async function createUser(input: DocumentDefinition<UserDocument>) {
        return await User.create(input);
}

export async function validatePassword({ email, password, }: { email: UserDocument["email"], password: string }) {
    const user = await User.findOne({email});
    // "$or": [
    //     {"username": email},
    //     {"email": email}
    // ]});

    if(!user){
        return false;
    }

    const isValid = await user.comparePassword(password);
    if(!isValid)
    {
        return false;
    }

    return  omit(user.toJSON(),"password");
}


export async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
  }