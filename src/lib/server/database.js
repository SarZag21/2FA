// Import MySQL with Promise support
import mysql from 'mysql2/promise';

// Import database settings from environment variables
import {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} from '$env/static/private';

// Create a connection pool for the database
const pool = mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

// Export the pool so it can be used in other files
export default pool;