const Joi = require('joi');
const SchoolModel = require('../models/school.model');

class SchoolController {
    static async addSchool(req, res) {
        // Define Joi schema for input validation
        const schema = Joi.object({
            name: Joi.string().trim().required().messages({
                'string.empty': '"name" cannot be empty',
                'any.required': '"name" is required'
            }),
            address: Joi.string().trim().required().messages({
                'string.empty': '"address" cannot be empty',
                'any.required': '"address" is required'
            }),
            latitude: Joi.number().min(-90).max(90).required().messages({
                'number.base': '"latitude" must be a number',
                'number.min': '"latitude" must be between -90 and 90',
                'number.max': '"latitude" must be between -90 and 90',
                'any.required': '"latitude" is required'
            }),
            longitude: Joi.number().min(-180).max(180).required().messages({
                'number.base': '"longitude" must be a number',
                'number.min': '"longitude" must be between -180 and 180',
                'number.max': '"longitude" must be between -180 and 180',
                'any.required': '"longitude" is required'
            })
        });

        // Validate request body
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const newSchoolId = await SchoolModel.addSchool(value);
            res.status(201).json({
                message: 'School added successfully',
                schoolId: newSchoolId,
                data: value
            });
        } catch (dbError) {
            console.error('Error adding school:', dbError);
            res.status(500).json({ error: 'Internal server error while adding school' });
        }
    }

    static async listSchools(req, res) {
        // Define Joi schema for query parameters validation
        const schema = Joi.object({
            latitude: Joi.number().min(-90).max(90).required().messages({
                'number.base': '"latitude" must be a valid number',
                'any.required': '"latitude" query parameter is required'
            }),
            longitude: Joi.number().min(-180).max(180).required().messages({
                'number.base': '"longitude" must be a valid number',
                'any.required': '"longitude" query parameter is required'
            })
        });

        const { error, value } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const schools = await SchoolModel.getAllSchoolsSortedByDistance(value.latitude, value.longitude);
            res.status(200).json({
                message: 'Schools fetched successfully',
                count: schools.length,
                data: schools
            });
        } catch (dbError) {
            console.error('Error fetching schools:', dbError);
            res.status(500).json({ error: 'Internal server error while fetching schools' });
        }
    }
}

module.exports = SchoolController;
