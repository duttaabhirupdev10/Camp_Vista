const { Resend } = require('resend');

// Initialize Resend with the API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports.sendMail = async (to, subject, text) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.log('⚠️ RESEND_API_KEY is not set in .env. Email skipped.');
            return;
        }

        const data = await resend.emails.send({
            from: 'CampVista System <onboarding@resend.dev>', // Update this to a verified domain when you have one
            to: to,
            subject: subject,
            text: text
        });

        console.log('----------------------------------------------------');
        console.log(`✉️ EMAIL SENT VIA RESEND TO: ${to}`);
        console.log(`✉️ SUBJECT: ${subject}`);
        console.log(`✅ MESSAGE ID: ${data.id}`);
        console.log('----------------------------------------------------');
    } catch (error) {
        console.error('Error sending email via Resend:', error);
    }
};
