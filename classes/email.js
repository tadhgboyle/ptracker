const nodemailer = require('nodemailer');
const User = require('../models/user');
const Role = require('../models/role');

module.exports = class Email {

    static transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    });

    static async sendToAdmins(subject, content) {
        const adminEmails = [];
        const users = await User.all();

        for (const user of users) {
            if (user.role === Role.ADMIN) {
                adminEmails.push(user.email);
            }
        }

        await Email.transporter.sendMail({
            from: `PTracker Notifications ${process.env.EMAIL_USERNAME}`,
            to: adminEmails.join(', '),
            subject: subject,
            text: content,
        });
    }

}
