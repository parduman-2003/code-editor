const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
require('dotenv').config();
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/view'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/virtual-science-lab', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

// Define the schema for the collection
const favoriteSchema = new mongoose.Schema({
    html: String,
    css: String,
    js: String,
    output: String,
    createdAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Favorite = mongoose.model('Favorite', favoriteSchema);

// Route to save a favorite collection
app.post("/save-favorite", async (req, res) => {
    try {
        const { html, css, js, output } = req.body;

        // Log the incoming data
        console.log('Data Received:', { html, css, js, output });

        // Save to the database
        const favorite = new Favorite({ html, css, js, output });
        await favorite.save();

        res.json({ success: true, message: 'Favorite saved successfully!' });
    } catch (error) {
        console.error('Error saving favorite:', error);
        res.status(500).json({ success: false, message: 'Error saving favorite.' });
    }
});

// Route to fetch all collections
app.get('/my-collection', async (req, res) => {
    try {
        const favorites = await Favorite.find(); // Fetch all favorite documents
        if (favorites.length === 0) {
            return res.json({ success: true, message: 'No collections found.' });
        }
        res.json({ favorites });  // Return the collection data as JSON
    } catch (err) {
        console.error('Error fetching collections:', err);
        res.status(500).json({ success: false, message: 'Error fetching collections.' });
    }
});

// Route to delete a collection
app.delete('/collection/:id', async (req, res) => {
    const collectionId = req.params.id;
    try {
        const result = await Favorite.findByIdAndDelete(collectionId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Collection not found.' });
        }
        res.status(200).json({ success: true, message: 'Collection deleted successfully.' });
    } catch (err) {
        console.error('Error deleting collection:', err);
        res.status(500).json({ success: false, message: 'Error deleting collection.' });
    }
});

// Route to fetch a single collection's data
app.get('/collection/:id', async (req, res) => {
    const collectionId = req.params.id;
    try {
        const collection = await Favorite.findById(collectionId);
        if (collection) {
            res.json({ success: true, collection });
        } else {
            res.status(404).json({ success: false, message: 'Collection not found' });
        }
    } catch (err) {
        console.error('Error fetching collection:', err);
        res.status(500).json({ success: false, message: 'Error fetching collection' });
    }
});

// AI Chatbot Route
app.get("/ai", (req, res) => {
    res.render("./my-ai.ejs");
});


// Route to handle chatbot messages from the frontend
app.post('/chatbot', async (req, res) => {
  const { message } = req.body;

  // Get the response from the Gemini API
  const botResponse = await getGeminiResponse(message);

  // Send the AI response back to the frontend
  res.json({ reply: botResponse });
});

// Example route for the editor
app.get("/", (req, res) => {
    res.render('editor');
});

// Route for the collections page
app.get("/collection", (req, res) => {
    res.render('./collection.ejs');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
