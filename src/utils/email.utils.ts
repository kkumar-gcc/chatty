import nodemailer from "nodemailer";
// import Mail from "nodemailer/lib/mailer";
import ejs from "ejs";
import fs from "fs-extra"
export async function sendEmail(email: string,title:string,name:string,link:string) {

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "a@b.com",
            pass: "******"
        },
        // logger: true
      });
    await ejs.renderFile(__dirname + "/resetPasswordMail.ejs", { name: name,email:email,link:link }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mainOptions = {
                from: '"no reply" a@B.COM',
                to: `${email}`,
                subject: `${title}`,
                html: data
            };
          transporter.sendMail(mainOptions, function (e, info) {
                if (e) {
                   return false;
                } else {
                    return true;
                }
            });
        }}); 
   
}