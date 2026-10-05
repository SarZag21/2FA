import pool from '$lib/server/database.js';
import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
 
function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}
 
export async function GET({ cookies }) {
    const sessionToken = cookies.get('session_token');
 
    if (sessionToken) {
        const sessionHash = sha256(sessionToken);
 
        await pool.execute(
            `DELETE FROM user_sessions
             WHERE session_hash = ?`,
            [sessionHash]
        );
    }
 
    cookies.delete('session_token', {
        path: '/'
    });
 
    throw redirect(303, '/');
}