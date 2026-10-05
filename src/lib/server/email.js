// Import Nodemailer for sending emails
import nodemailer from 'nodemailer';

// Import SMTP settings from environment variables
import {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM
} from '$env/static/private';

// Create the email transporter
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    }
});

// Send the 2FA verification code by email
export async function sendVerificationEmail(email, code) {
    await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: 'Dein Sicherheitscode',
        text: `Dein Sicherheitscode lautet: ${code}. Der Code ist 5 Minuten gültig.`
    });
}