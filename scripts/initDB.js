const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    try {
        // Determine SSL configuration
        let sslConfig = undefined;
        if (process.env.DB_SSL === 'true') {
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

        const dbName = process.env.DB_NAME || 'school_db';
        const port = parseInt(process.env.DB_PORT) || 3306;

        // Connect to the database directly (Aiven already provides a default database)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: port,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            ssl: sslConfig
        });

        console.log(`Connected to database '${dbName}'.`);

        // Create schools table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS schools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                latitude FLOAT NOT NULL,
                longitude FLOAT NOT NULL
            );
        `;

        await connection.query(createTableQuery);
        console.log("Table 'schools' created or already exists.");

        await connection.end();
        console.log("Database initialization completed successfully.");
    } catch (error) {
        console.error("Error initializing database:", error.message);
        process.exit(1);
    }
}

initDB();
