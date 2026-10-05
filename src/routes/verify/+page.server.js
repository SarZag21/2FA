// Import SvelteKit functions for errors and redirects
import { fail, redirect } from '@sveltejs/kit';
// Import the database connection
import pool from '$lib/server/database.js';
// Import crypto for creating secure hashes and random tokens
import crypto from 'crypto';


// Convert a value into a SHA-256 hash so sensitive values
// do not need to be stored directly in the database
function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}


// Check if a verification request exists before opening the verification page
export function load({ cookies }) {
    const requestToken = cookies.get('verification_request');

// Redirect to login if there is no verification request
    if (!requestToken) {
        throw redirect(303, '/');
    }
}

export const actions = {
    default: async ({ request, cookies }) => {
       
         // Read the verification code entered by the user
        const formData = await request.formData();
        const code = formData.get('code')?.toString();

         // Check if the code contains exactly 6 digits
        if (!code || !/^\d{6}$/.test(code)) {
            return fail(400, {
                error: 'Bitte gib einen gültigen 6-stelligen Code ein.'
            });
        }


    // Get the verification request token from the browser cookie
        const requestToken = cookies.get('verification_request');

if (!requestToken) {
    throw redirect(303, '/');
}

 // Hash the request token to compare it with the hash stored in the database
const requestHash = sha256(requestToken);

// Find the matching verification request in the database
const [verificationRequests] = await pool.execute(
    `SELECT *
     FROM verification_codes
     WHERE request_hash = ?`,
    [requestHash]
);

// Stop if no matching verification request was found
if (verificationRequests.length === 0) {
    return fail(400, {
        error: 'Die Verifizierungsanfrage wurde nicht gefunden.'
    });
}


const verification = verificationRequests[0];

 // Check if the 2FA code has expired
if (new Date(verification.valid_until) < new Date()) {
    return fail(400, {
        error: 'Der Sicherheitscode ist abgelaufen.'
    });
}

 // Block verification after 5 failed attempts
if (verification.failed_attempts >= 5) {
    return fail(429, {
        error: 'Zu viele falsche Versuche.'
    });
}



// Hash the code entered by the user
const enteredCodeHash = sha256(code);
 
// Compare the entered code hash with the hash stored in the database
if (enteredCodeHash !== verification.verification_hash) {
 
// Increase the number of failed attempts when the code is incorrect
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

// Create a random session token after successful 2FA verification
const sessionToken = crypto.randomBytes(32).toString('hex');

// Hash the session token so the original token is not stored in the database
const sessionHash = sha256(sessionToken);

// Make the session valid for 24 hours
const sessionValidUntil =
    new Date(Date.now() + 24 * 60 * 60 * 1000);

 // Save the new session in the database
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

 // Store the original session token in a secure browser cookie
cookies.set('session_token', sessionToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 60 * 60 * 24
});
 
 // Delete the temporary verification cookie because 2FA is complete
cookies.delete('verification_request', {
    path: '/'
});
 
// Redirect the authenticated user to the dashboard
throw redirect(303, '/dashboard');
    }
};