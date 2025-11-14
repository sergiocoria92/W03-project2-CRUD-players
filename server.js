// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectToServer } = require('./db/connect');
const playersRoutes = require('./routes/players');

// 👉 importa swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// 👉 aquí va swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas principales
app.use('/players', playersRoutes);

// Ruta para probar rápido que el server vive
app.get('/', (req, res) => {
  res.json({ message: 'API W03 funcionando 🚀' });
});

// Manejo de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Conectarse a MongoDB y luego iniciar el servidor
connectToServer((err) => {
  if (err) {
    console.error('❌ No se pudo conectar a MongoDB:', err);
    process.exit(1);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${port}`);
    });
  }
});
