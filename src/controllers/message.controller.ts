import { Request, Response, NextFunction } from 'express';
import log from '../logger';
import async from 'async';
import User from '../models/user.model';
import { createMessage } from '../services/message.service';
import { nextTick } from 'process';
// export async function getChatHandler(req: Request, res: Response) {
//     var users = await User.find() as any;
//     return res.render("privatechat.ejs",{users:users,user:req.session.user});
// }
export async function postMessageHandler(req: Request, res: Response, next: NextFunction) {

    // return res.render()    ;
    // const user = req.session.user as any;

    const params = req.params.id.split('-');

    const receiverId = params[0];
log.info(req.body.message);
    async.waterfall([
        function(callback: any) {
            if (req.body.message) {
               const receiver = User.findOne({ "_id": Object(receiverId) }, (err: any, data: any) => {
                    callback(err, data);
                });
            }
        },
        function(data:any,callback:any){
            if (req.body.message) {
                const receiver = User.findOne({ "_id": Object(receiverId) }, (err: any, data: any) => {
                     callback(err, data);
                 });
             }
        }
    ],function(err,result){
      res.redirect("/chat/"+req.params.id);
    });
    // async.waterfall([
    //     function (callback: any) {
    //         if (req.body.message) {
    //             const receiver = User.findOne({ "_id": Object(receiverId) }, (err: any, data: any) => {
    //                 callback(err, data);
    //             });
    //         };
    //     },
    //    async function (data: any, callback: any) {
    //         if (req.body.message) {
    //             try{
    //                 const message = await createMessage(req.body.message, data._id, user._id);
    //                 console.log(message);
    //                 callback(message);
    //             }catch(e:any){
    //                 return next(e);
    //             }
    //         }
    //     }

    // ], (err: any, results: any) => {
    //     return res.redirect('/chat/' + params);
    // });




}