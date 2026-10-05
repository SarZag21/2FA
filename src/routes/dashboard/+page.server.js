import { redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';
import crypto from 'crypto';

// Create a SHA-256 hash
function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}
 
// Check if the user has a valid session
export async function load({ cookies }) {

      // Get the session token from the cookie
    const sessionToken = cookies.get('session_token');
 
     // Redirect to login if there is no session token
    if (!sessionToken) {

        throw redirect(303, '/');

    }

 // Hash the session token
    const sessionHash = sha256(sessionToken);

// Search for the session in the database
const [sessions] = await pool.execute(
    `SELECT *
     FROM user_sessions
     WHERE session_hash = ?`,
    [sessionHash]
);

// Redirect to login if the session does not exist
if (sessions.length === 0) {
    cookies.delete('session_token', {
        path: '/'
    });

    throw redirect(303, '/');
}

 // Get the session data
const session = sessions[0];

// Check if the session has expired
if (new Date(session.valid_until) < new Date()) {
 
    // Delete the expired session from the database
    await pool.execute(
        `DELETE FROM user_sessions
         WHERE session_id = ?`,
        [session.session_id]
    );
 
     // Delete the session cookie
    cookies.delete('session_token', {
        path: '/'
    });
 
    throw redirect(303, '/');
}

}
 