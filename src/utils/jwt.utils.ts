import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/default";
import log from "../logger";

const privateKey = config.privateKey as string;
const publicKey=config.publicKey as string;

export function signJwt(object:object,options?:jwt.SignOptions|undefined){
    return jwt.sign(object,privateKey,options??{ expiresIn: config.accessTokenTtl });
}

// eexport function signJwt(object:Object,options?:jwt.SignOptions|undefined){
//     return jwt.sign(object,privateKey,{
//         ...(options&&options),
//         algorithm:"RS256"
//     })
// }


export  async function verifyJwt(token:string){

    try{
        const decoded= await jwt.verify(token,privateKey);

        return ({
            valid:true,
            expired:false,
            decoded,
        });
    }catch(e:any){
        return ({
             valid:false,
             expired:e.message==="jwt expired",
             decoded:null,
        });
    }

}