// controllers/players.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// ---- Función de validación ----
function validatePlayer(data) {
  const errors = [];

  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push('firstName es requerido y debe ser texto.');
  }
  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push('lastName es requerido y debe ser texto.');
  }
  if (!data.sport || typeof data.sport !== 'string') {
    errors.push('sport es requerido y debe ser texto.');
  }
  if (!data.team || typeof data.team !== 'string') {
    errors.push('team es requerido y debe ser texto.');
  }
  if (
    data.age === undefined ||
    typeof data.age !== 'number' ||
    !Number.isInteger(data.age) ||
    data.age <= 0
  ) {
    errors.push('age es requerido y debe ser un número entero mayor que 0.');
  }
  if (
    data.rating === undefined ||
    typeof data.rating !== 'number' ||
    data.rating < 0 ||
    data.rating > 100
  ) {
    errors.push('rating es requerido y debe ser un número entre 0 y 100.');
  }
  if (typeof data.isActive !== 'boolean') {
    errors.push('isActive es requerido y debe ser true o false (booleano).');
  }

  return errors;
}

// ---- GET /players ----
async function getAllPlayers(req, res) {
  try {
    const db = getDb();
    const players = await db.collection('players').find().toArray();
    res.status(200).json(players);
  } catch (err) {
    console.error('Error en getAllPlayers:', err);
    res.status(500).json({ error: 'Error al obtener los jugadores.' });
  }
}

// ---- GET /players/:id ----
async function getPlayerById(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const db = getDb();
    const player = await db
      .collection('players')
      .findOne({ _id: new ObjectId(id) });

    if (!player) {
      return res.status(404).json({ error: 'Jugador no encontrado.' });
    }

    res.status(200).json(player);
  } catch (err) {
    console.error('Error en getPlayerById:', err);
    res.status(500).json({ error: 'Error al obtener el jugador.' });
  }
}

// ---- POST /players ----
async function createPlayer(req, res) {
  try {
    const playerData = req.body;

    const errors = validatePlayer(playerData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const db = getDb();
    const result = await db.collection('players').insertOne(playerData);

    res
      .status(201)
      .json({ message: 'Jugador creado correctamente.', id: result.insertedId });
  } catch (err) {
    console.error('Error en createPlayer:', err);
    res.status(500).json({ error: 'Error al crear el jugador.' });
  }
}

// ---- PUT /players/:id ----
async function updatePlayer(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const playerData = req.body;
    const errors = validatePlayer(playerData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const db = getDb();
    const result = await db
      .collection('players')
      .updateOne({ _id: new ObjectId(id) }, { $set: playerData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Jugador no encontrado.' });
    }

    res.status(200).json({ message: 'Jugador actualizado correctamente.' });
  } catch (err) {
    console.error('Error en updatePlayer:', err);
    res.status(500).json({ error: 'Error al actualizar el jugador.' });
  }
}

// ---- DELETE /players/:id ----
async function deletePlayer(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID no válido.' });
    }

    const db = getDb();
    const result = await db
      .collection('players')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Jugador no encontrado.' });
    }

    res.status(200).json({ message: 'Jugador eliminado correctamente.' });
  } catch (err) {
    console.error('Error en deletePlayer:', err);
    res.status(500).json({ error: 'Error al eliminar el jugador.' });
  }
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
