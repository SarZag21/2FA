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


        return {
            success: true
        };
    }
};