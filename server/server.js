const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// connect to db
mongoose.connect(process.env.DATABASE_CLOUD, {})
        .then(() => console.log("DB connected"))
        .catch((err) => console.log("DB Error => ", err));

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const linkRoutes = require('./routes/link');

// apply middlewares
app.use(morgan('dev')); // dev mode
//app.use(bodyParser.json()); // parse JSON in request body
app.use(bodyParser.json({limit: '5mb', type: 'application/json'}));
app.use(cors({ origin: process.env.CLIENT_URL })); // allow frontend to communicate with backend API

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', linkRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`API is running on port ${port}`));