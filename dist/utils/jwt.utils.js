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
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const default_1 = __importDefault(require("../config/default"));
const privateKey = default_1.default.privateKey;
const publicKey = default_1.default.publicKey;
function signJwt(object, options) {
    return jsonwebtoken_1.default.sign(object, privateKey, options !== null && options !== void 0 ? options : { expiresIn: default_1.default.accessTokenTtl });
}
exports.signJwt = signJwt;
// eexport function signJwt(object:Object,options?:jwt.SignOptions|undefined){
//     return jwt.sign(object,privateKey,{
//         ...(options&&options),
//         algorithm:"RS256"
//     })
// }
function verifyJwt(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = yield jsonwebtoken_1.default.verify(token, privateKey);
            return ({
                valid: true,
                expired: false,
                decoded,
            });
        }
        catch (e) {
            return ({
                valid: false,
                expired: e.message === "jwt expired",
                decoded: null,
            });
        }
    });
}
exports.verifyJwt = verifyJwt;
