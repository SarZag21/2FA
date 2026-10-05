import pool from '$lib/server/database.js';
import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
 
// Convert the session token into a SHA-256 hash so the original token is not stored in the database
function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}

// Handle the logout request
export async function GET({ cookies }) {
      // Get the session token from the cookie
    const sessionToken = cookies.get('session_token');
    // Check if a session token exists
    if (sessionToken) {
        const sessionHash = sha256(sessionToken);
 
      // Delete the session from the database
        await pool.execute(
            `DELETE FROM user_sessions
             WHERE session_hash = ?`,
            [sessionHash]
        );
    }
 
    // Delete the session cookie so the browser no longer keeps the user logged in
    cookies.delete('session_token', {
        path: '/'
    });
 
    throw redirect(303, '/');
}