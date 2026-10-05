import pool from '$lib/server/database.js';
import { sendVerificationEmail } from '$lib/server/email.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { fail, redirect } from '@sveltejs/kit';


// Convert a value into a SHA-256 hash so the original value
// does not need to be stored directly in the database
function sha256(value) {
    return crypto
        .createHash('sha256')
        .update(value)
        .digest('hex');
}

export const actions = {
    default: async ({ request, cookies }) => {

        // Read the email and password entered in the login form
        const formData = await request.formData();

        const email = formData.get('email');
        const password = formData.get('password');

       // Search for an account with the entered email        
        const [accounts] = await pool.execute(
            `SELECT *
             FROM accounts
             WHERE email = ?`,
            [email]
        );

         // Return an error if the account does not exist
        if (accounts.length === 0) {
            return fail(400, {
                error: 'E-Mail oder Passwort ist falsch.'
            });
        }

        // Get the account data from the database result
        const account = accounts[0];

        // Compare the entered password with the password hash in the database
        const passwordCorrect = await bcrypt.compare(
            password,
            account.password_hash
        );

         // Return an error if the password is incorrect
        if (!passwordCorrect) {
            return fail(400, {
                error: 'E-Mail oder Passwort ist falsch.'
            });
        }
        
        // Generate a random 6-digit verification code
        const verificationCode =
            crypto.randomInt(100000, 1000000).toString();

        // Hash the verification code before storing it in the database
        const verificationHash = sha256(verificationCode);

       // Generate a random token for this verification request
        const requestToken =
            crypto.randomBytes(32).toString('hex');

        // Hash the request token before storing it in the database
        const requestHash = sha256(requestToken);

        // Make the verification code valid for 5 minutes
        const validUntil =
            new Date(Date.now() + 5 * 60 * 1000);

      // Save the verification request and the hashed code in the database
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

        // Send the original 6-digit verification code to the user's email
      await sendVerificationEmail(
        account.email,
        verificationCode
      );

      // Store the verification request token in a browser cookie
      // so the verification page knows which login attempt belongs to the user
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