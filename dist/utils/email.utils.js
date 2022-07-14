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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// import Mail from "nodemailer/lib/mailer";
const ejs_1 = __importDefault(require("ejs"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("../logger"));
dotenv_1.default.config();
function sendEmail(email, title, name, link) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporter = nodemailer_1.default.createTransport({
            host: `${process.env.MAIL_HOST}`,
            port: Number(process.env.EMAIL_PORT) || 0,
            secure: false,
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: `${process.env.MAIL_USERNAME}`,
                pass: `${process.env.MAIL_PASSWORD}`
            },
            logger: true
        });
        yield ejs_1.default.renderFile(__dirname + "/../views/resetPasswordMail.ejs", { name, email, link }, (err, data) => {
            if (err) {
                logger_1.default.error(err);
            }
            else {
                const mainOptions = {
                    from: '"no reply"',
                    to: `${email}`,
                    subject: `${title}`,
                    html: data
                };
                transporter.sendMail(mainOptions, (e, info) => {
                    if (e) {
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
        });
    });
}
exports.sendEmail = sendEmail;
