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
exports.getFriends = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
function getFriends(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const friends = yield user_model_1.default.aggregate([
            { "$match": { _id: new mongoose_1.default.Types.ObjectId(id) } },
            {
                "$lookup": {
                    "from": user_model_1.default.collection.name,
                    "localField": "friends.user",
                    "foreignField": "_id",
                    "let": { "friends": "$friends" },
                    "pipeline": [
                        {
                            "$project": {
                                "name": 1,
                                "email": 1,
                                'username': 1,
                                'description': 1
                            }
                        }
                    ],
                    "as": "friends"
                }
            }
        ]);
        // log.info(friends);
    });
}
exports.getFriends = getFriends;
