import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';
import crypto from 'crypto';

function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}

export function load({ cookies }) {
    const requestToken = cookies.get('verification_request');

    if (!requestToken) {
        throw redirect(303, '/');
    }
}

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();

        const code = formData.get('code')?.toString();

        if (!code || !/^\d{6}$/.test(code)) {
            return fail(400, {
                error: 'Bitte gib einen gültigen 6-stelligen Code ein.'
            });
        }

        const requestToken = cookies.get('verification_request');

if (!requestToken) {
    throw redirect(303, '/');
}

const requestHash = sha256(requestToken);

const [verificationRequests] = await pool.execute(
    `SELECT *
     FROM verification_codes
     WHERE request_hash = ?`,
    [requestHash]
);

if (verificationRequests.length === 0) {
    return fail(400, {
        error: 'Die Verifizierungsanfrage wurde nicht gefunden.'
    });
}


const verification = verificationRequests[0];

if (new Date(verification.valid_until) < new Date()) {
    return fail(400, {
        error: 'Der Sicherheitscode ist abgelaufen.'
    });
}

if (verification.failed_attempts >= 5) {
    return fail(429, {
        error: 'Zu viele falsche Versuche.'
    });
}

// Eingegebenen Code hashen
const enteredCodeHash = sha256(code);
 
// Code mit gespeichertem Hash vergleichen
if (enteredCodeHash !== verification.verification_hash) {
 
    await pool.execute(
        `UPDATE verification_codes
         SET failed_attempts = failed_attempts + 1
         WHERE verification_id = ?`,
        [verification.verification_id]
    );
 
    return fail(400, {
        error: 'Der Sicherheitscode ist falsch.'
    });
}

// Session-Token erzeugen
const sessionToken = crypto.randomBytes(32).toString('hex');

// Session-Token hashen
const sessionHash = sha256(sessionToken);

// Session ist 24 Stunden gültig
const sessionValidUntil =
    new Date(Date.now() + 24 * 60 * 60 * 1000);

// Session in der Datenbank speichern
await pool.execute(
    `INSERT INTO user_sessions
        (
            account_id,
            session_hash,
            valid_until
        )
     VALUES (?, ?, ?)`,
    [
        verification.account_id,
        sessionHash,
        sessionValidUntil
    ]
);

        return {
            success: true
        };
    }
};