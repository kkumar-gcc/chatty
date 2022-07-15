import config from '../config/default';
import { FilterQuery,DocumentDefinition } from 'mongoose';
import { get, Omit } from 'lodash';
import log from '../logger';
import Message from '../models/message.model';

export async function createMessage(content:string,receiver: string,sender: string) {
        const message = await Message.create({ message:content,receiver,sender});
        return message.toJSON();
}
