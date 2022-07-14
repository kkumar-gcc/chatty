"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessageHandler = void 0;
const async_1 = __importDefault(require("async"));
const user_model_1 = __importDefault(require("../models/user.model"));
const message_service_1 = require("../services/message.service");
const lodash_1 = require("lodash");
// export async function getChatHandler(req: Request, res: Response) {
//     var users = await User.find() as any;
//     return res.render("privatechat.ejs",{users:users,user:req.session.user});
// }
function postMessageHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.session.user;
        const params = req.params.id.split('-');
        const receiverId = params[0];
        async_1.default.waterfall([
            (callback) => {
                if (req.body.message) {
                    const receiver = user_model_1.default.findOne({ "_id": Object(receiverId) }, (err, data) => {
                        callback(err, (0, lodash_1.omit)(data.toJSON(), "password"));
                    });
                }
            },
            (data, callback) => __awaiter(this, void 0, void 0, function* () {
                if (req.body.message) {
                    const message = yield (0, message_service_1.createMessage)(req.body.message, data._id, user._id);
                    callback(message);
                }
            })
        ], (err, result) => {
            res.redirect("/chat/" + req.params.id);
        });
    });
}
exports.postMessageHandler = postMessageHandler;
