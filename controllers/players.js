// controllers/players.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// ---- Validation function ----
function validatePlayer(data) {
  const errors = [];

  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push('firstName is required and must be a string.');
  }
  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push('lastName is required and must be a string.');
  }
  if (!data.sport || typeof data.sport !== 'string') {
    errors.push('sport is required and must be a string.');
  }
  if (!data.team || typeof data.team !== 'string') {
    errors.push('team is required and must be a string.');
  }
  if (
    data.age === undefined ||
    typeof data.age !== 'number' ||
    !Number.isInteger(data.age) ||
    data.age <= 0
  ) {
    errors.push('age is required and must be an integer greater than 0.');
  }
  if (
    data.rating === undefined ||
    typeof data.rating !== 'number' ||
    data.rating < 0 ||
    data.rating > 100
  ) {
    errors.push('rating is required and must be a number between 0 and 100.');
  }
  if (typeof data.isActive !== 'boolean') {
    errors.push('isActive is required and must be true or false (boolean).');
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
    console.error('Error in getAllPlayers:', err);
    res.status(500).json({ error: 'Error while getting players.' });
  }
}

// ---- GET /players/:id ----
async function getPlayerById(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID.' });
    }

    const db = getDb();
    const player = await db
      .collection('players')
      .findOne({ _id: new ObjectId(id) });

    if (!player) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.status(200).json(player);
  } catch (err) {
    console.error('Error in getPlayerById:', err);
    res.status(500).json({ error: 'Error while getting the player.' });
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
      .json({ message: 'Player created successfully.', id: result.insertedId });
  } catch (err) {
    console.error('Error in createPlayer:', err);
    res.status(500).json({ error: 'Error while creating the player.' });
  }
}

// ---- PUT /players/:id ----
async function updatePlayer(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID.' });
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
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.status(200).json({ message: 'Player updated successfully.' });
  } catch (err) {
    console.error('Error in updatePlayer:', err);
    res.status(500).json({ error: 'Error while updating the player.' });
  }
}

// ---- DELETE /players/:id ----
async function deletePlayer(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID.' });
    }

    const db = getDb();
    const result = await db
      .collection('players')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Player not found.' });
    }

    res.status(200).json({ message: 'Player deleted successfully.' });
  } catch (err) {
    console.error('Error in deletePlayer:', err);
    res.status(500).json({ error: 'Error while deleting the player.' });
  }
}

module.exports = {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
