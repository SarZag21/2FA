import pool from '$lib/server/database.js';
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