import pool from '$lib/server/database.js';
import { sendVerificationEmail } from '$lib/server/email.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { fail, redirect } from '@sveltejs/kit';

function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();

        const email = formData.get('email');
        const password = formData.get('password');

        // Benutzer anhand der E-Mail suchen
        const [accounts] = await pool.execute(
            `SELECT *
             FROM accounts
             WHERE email = ?`,
            [email]
        );

        if (accounts.length === 0) {
            return fail(400, {
                error: 'E-Mail oder Passwort ist falsch.'
            });
        }

        const account = accounts[0];

        // Passwort überprüfen
        const passwordCorrect = await bcrypt.compare(
            password,
            account.password_hash
        );

        if (!passwordCorrect) {
            return fail(400, {
                error: 'E-Mail oder Passwort ist falsch.'
            });
        }
            // 6-stelligen 2FA-Code erzeugen
        const verificationCode =
            crypto.randomInt(100000, 1000000).toString();

        // Code hashen
        const verificationHash = sha256(verificationCode);

        // Zufällige ID für diesen Login-Versuch erzeugen
        const requestToken =
            crypto.randomBytes(32).toString('hex');

        const requestHash = sha256(requestToken);

        // Code ist 5 Minuten gültig
        const validUntil =
            new Date(Date.now() + 5 * 60 * 1000);

        // 2FA-Anfrage in der Datenbank speichern
        await pool.execute(
            `INSERT INTO verification_codes
                (
                    account_id,
                    request_hash,
                    verification_hash,
                    valid_until
                )
             VALUES (?, ?, ?, ?)`,
            [
                account.account_id,
                requestHash,
                verificationHash,
                validUntil
            ]
        );

      await sendVerificationEmail(
    account.email,
    verificationCode
);

        // Login-Versuch im Browser merken
        cookies.set('verification_request', requestToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 300
        });

        throw redirect(303, '/verify');
    }
};