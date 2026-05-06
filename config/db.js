const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Determine SSL configuration
let sslConfig = undefined;
if (process.env.DB_SSL === 'true') {
    // For production: use CA certificate
    // Support both file-based and inline CA cert
    if (process.env.DB_CA_CERT) {
        sslConfig = {
            ca: process.env.DB_CA_CERT,
            rejectUnauthorized: true
        };
    } else {
        const caPath = path.join(__dirname, '..', 'certs', 'ca.pem');
        if (fs.existsSync(caPath)) {
            sslConfig = {
                ca: fs.readFileSync(caPath, 'utf8'),
                rejectUnauthorized: true
            };
        }
    }
}

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_db',
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
