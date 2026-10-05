import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
 
const pool = mysql.createPool({
    host: 'htl-datenbank.com',
    user: 'ronvol20',
    password: '1INSY$data',
    database: 'ronvol20_2FA',
    port: 28474
});
 
const email = 'sarazaganjori5@gmail.com';
const password = '12345678';
 
const passwordHash = await bcrypt.hash(password, 10);
 
await pool.execute(
    `INSERT INTO accounts (email, password_hash)
     VALUES (?, ?)`,
    [email, passwordHash]
);
 
console.log('Test account created.');
 
await pool.end();