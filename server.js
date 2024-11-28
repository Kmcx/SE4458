const express = require('express');
const connectDB = require('./config/db');
const {swaggerUi, swaggerDocs}= require('./config/swagger'); 
const app = express();
require('dotenv').config();


connectDB();

// Middleware
app.use(express.json());

app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocs));


app.use('/api/auth', require('./routes/auth'));

app.use('/api/listings', require('./routes/listings'));

app.use('/api/bookings', require('./routes/bookings'));

app.use('/api/admin', require('./routes/admin'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
