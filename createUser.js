import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
 
// Create a connection pool to the database
const pool = mysql.createPool({
    host: 'htl-datenbank.com',
    user: 'ronvol20',
    password: '1INSY$data',
    database: 'ronvol20_2FA',
    port: 28474
});
 
// Define the test user's login data
const email = 'sarazaganjori5@gmail.com';
const password = '12345678';
 
// Hash the password before storing it in the database
const passwordHash = await bcrypt.hash(password, 10);
 
// Insert the test account into the database
await pool.execute(
    `INSERT INTO accounts (email, password_hash)
     VALUES (?, ?)`,
    [email, passwordHash]
);
 
// Confirm that the account was created
console.log('Test account created.');
 
// Close the database connection pool
await pool.end();