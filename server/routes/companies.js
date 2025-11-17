import express from 'express';
const router = express.Router();
import Company from '../models/Company.js';

// GET /companies - Get all companies
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /companies/:id - Get company by id
router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findOne({ id: req.params.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /companies - Create new company
router.post('/', async (req, res) => {
    const company = new Company({
        id: req.body.id,
        name: req.body.name,
        industry: req.body.industry,
        location: req.body.location,
        size: req.body.size,
        website: req.body.website
    });

    try {
        const newCompany = await company.save();
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /companies/:id - Update company
router.put('/:id', async (req, res) => {
    try {
        const company = await Company.findOne({ id: req.params.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        company.id = req.body.id || company.id;
        company.name = req.body.name || company.name;
        company.industry = req.body.industry || company.industry;
        company.location = req.body.location || company.location;
        company.size = req.body.size || company.size;
        company.website = req.body.website || company.website;
        company.updatedAt = Date.now();

        const updatedCompany = await company.save();
        res.json(updatedCompany);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /companies/:id - Delete company
router.delete('/:id', async (req, res) => {
    try {
        const company = await Company.findOne({ id: req.params.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        await Company.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;