import nodemailer from "nodemailer";
// import Mail from "nodemailer/lib/mailer";
import ejs from "ejs";
import fs from "fs-extra"
import dotenv from 'dotenv';
import log from "../logger";
dotenv.config();
export async function sendEmail(email: string, title: string, name: string, link: string) {

    const transporter = nodemailer.createTransport({
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
    await ejs.renderFile(__dirname + "/../views/resetPasswordMail.ejs", { name, email, link },(err, data) => {
        if (err) {
            log.error(err);
        } else {
            const mainOptions = {
                from: '"no reply"',
                to: `${email}`,
                subject: `${title}`,
                html: data
            };
            transporter.sendMail(mainOptions,(e, info) => {
                if (e) {
                    return false;
                } else {
                    return true;
                }
            });
        }
    });

}