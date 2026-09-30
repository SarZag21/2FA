import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
 
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'two_factor_auth'
});
 
const email = 'test@test.com';
const password = '123456';
 
const passwordHash = await bcrypt.hash(password, 10);
 
await pool.execute(
    `INSERT INTO accounts (email, password_hash)
     VALUES (?, ?)`,
    [email, passwordHash]
);
 
console.log('Test account created.');
 
await pool.end();