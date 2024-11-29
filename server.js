const express = require('express');
const connectDB = require('./config/db');
const {swaggerUi, swaggerDocs}= require('./config/swagger'); 
const app = express();
require('dotenv').config();

const cors = require("cors");

app.use(cors({
    origin: "https://se4458.onrender.com",          
    methods: ["GET", "POST", "PUT", "DELETE"],  
    allowedHeaders: ["Content-Type", "Authorization"],  
  }));

connectDB();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome!, add a /api-docs endpoint for Swagger UI');
  });

app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocs));


app.use('/api/auth', require('./routes/auth'));

app.use('/api/listings', require('./routes/listings'));

app.use('/api/bookings', require('./routes/bookings'));

app.use('/api/admin', require('./routes/admin'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
