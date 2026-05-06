const db = require('../config/db');

class SchoolModel {
    static async addSchool(schoolData) {
        const { name, address, latitude, longitude } = schoolData;
        const query = `
            INSERT INTO schools (name, address, latitude, longitude)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [name, address, latitude, longitude]);
        return result.insertId;
    }

    static async getAllSchoolsSortedByDistance(userLat, userLng) {
        // Using the Haversine formula in SQL to calculate distance in kilometers
        const query = `
            SELECT id, name, address, latitude, longitude,
            (
                6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(?)) + 
                    sin(radians(?)) * sin(radians(latitude))
                )
            ) AS distance
            FROM schools
            ORDER BY distance ASC
        `;
        const [rows] = await db.execute(query, [userLat, userLng, userLat]);
        return rows;
    }
}

module.exports = SchoolModel;
