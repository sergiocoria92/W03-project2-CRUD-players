// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToServer } = require('./db/connect');
const playersRoutes = require('./routes/players');

// 👉 import swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// 👉 swagger goes here
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main routes
app.use('/players', playersRoutes);

// Simple route to quickly check if the server is alive
app.get('/', (req, res) => {
  res.json({ message: 'API W03 running 🚀' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and then start the server
connectToServer((err) => {
  if (err) {
    console.error('❌ Could not connect to MongoDB:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  }
});
