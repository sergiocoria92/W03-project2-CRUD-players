// routes/players.js
const express = require('express');
const router = express.Router();
const playersController = require('../controllers/players');

// GET: obtener todos los jugadores
router.get('/', playersController.getAllPlayers);

// GET: obtener un jugador por ID
router.get('/:id', playersController.getPlayerById);

// POST: crear un jugador
router.post('/', playersController.createPlayer);

// PUT: actualizar un jugador
router.put('/:id', playersController.updatePlayer);

// DELETE: eliminar un jugador
router.delete('/:id', playersController.deletePlayer);

// MUY IMPORTANTE: exportar SOLO el router
module.exports = router;
