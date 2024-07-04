require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.get('/products/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: `Product with ID ${id} not found` });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/product/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: `Cannot find any product with ID ${id}` });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB');
        app.listen(port, () => {
            console.log(`pritis-clothing-boutique-api app is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error(error);
    });
