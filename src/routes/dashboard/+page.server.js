import { redirect } from '@sveltejs/kit';
import pool from '$lib/server/database.js';
import crypto from 'crypto';

function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}
 
export async function load({ cookies }) {

    const sessionToken = cookies.get('session_token');
 
    if (!sessionToken) {

        throw redirect(303, '/');

    }


    const sessionHash = sha256(sessionToken);

const [sessions] = await pool.execute(
    `SELECT *
     FROM user_sessions
     WHERE session_hash = ?`,
    [sessionHash]
);

if (sessions.length === 0) {
    cookies.delete('session_token', {
        path: '/'
    });

    throw redirect(303, '/');
}

const session = sessions[0];
}
 