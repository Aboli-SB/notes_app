const express = require('express');
require('dotenv').config();
const cors = require('cors');
const http = require('http');
const connection = require('./config/db');
const userRouter = require('./routes/userroute');
const taskRouter = require('./routes/noteroute');
const app = express();
const server = require('http').createServer(app);
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ 
  origin: "http://localhost:3000", 
  credentials: true 
}));
app.use(express.json());


// Routes
app.get('/', (req, res) => res.status(200).json({ message: "Welcome to the Notes App!" }));
app.use('/user', userRouter);  // Fixed the route prefix
app.use('/note', taskRouter);


// Start the server and connect to the database
server.listen(PORT, async () => {
  try {
    await connection;
    console.log("✅ Successfully connected to the database");
    console.log(`🚀 Server is running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Error connecting to the database: ", error.message);
  }
});

