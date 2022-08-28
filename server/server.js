const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// import routes
const authRoutes = require('./routes/auth');

// apply middlewares
app.use(morgan('dev')); // dev mode
app.use(bodyParser.json()); // parse JSON in request body
app.use(cors({ origin: process.env.CLIENT_URL })); // allow frontend to communicate with backend API

app.use('/api', authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`API is running on port ${port}`));