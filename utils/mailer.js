const nodemailer = require('nodemailer');

let transporter;

// Create a test ethereal account dynamically for testing.
// In production, you would replace this with SendGrid, Gmail, etc.
nodemailer.createTestAccount((err, account) => {
    if (err) {
        console.error('Failed to create a testing account. ' + err.message);
        return;
    }
    transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
});

module.exports.sendMail = async (to, subject, text) => {
    try {
        if (!transporter) {
            console.log('Mailer not ready yet');
            return;
        }
        const info = await transporter.sendMail({
            from: '"CampVista System" <noreply@campvista.com>',
            to,
            subject,
            text
        });
        console.log('----------------------------------------------------');
        console.log(`✉️ EMAIL SENT TO: ${to}`);
        console.log(`✉️ SUBJECT: ${subject}`);
        console.log(`🔗 PREVIEW URL: ${nodemailer.getTestMessageUrl(info)}`);
        console.log('----------------------------------------------------');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
