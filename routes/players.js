// routes/players.js
const express = require('express');
const router = express.Router();
const playersController = require('../controllers/players');

// GET: get all players
router.get('/', playersController.getAllPlayers);

// GET: get a player by ID
router.get('/:id', playersController.getPlayerById);

// POST: create a new player
router.post('/', playersController.createPlayer);

// PUT: update a player
router.put('/:id', playersController.updatePlayer);

// DELETE: delete a player
router.delete('/:id', playersController.deletePlayer);

// VERY IMPORTANT: export ONLY the router
module.exports = router;
