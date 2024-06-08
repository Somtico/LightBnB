const express = require('express');
const { getAllProperties, addProperty } = require('../db/queries/properties');
const { getAllReservations } = require('../db/queries/reservations');

const router = express.Router();

router.get('/properties', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;  // Default to 10 if not specified
  getAllProperties(req.query, limit)
    .then((properties) => res.send({ properties }))
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

router.get('/reservations', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ error: 'error' });
  }

  getAllReservations(userId)
    .then((reservations) => res.send({ reservations }))
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

router.post('/properties', (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ error: 'error' });
  }

  const newProperty = req.body;
  newProperty.owner_id = userId;
  addProperty(newProperty)
    .then((property) => {
      res.send(property);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

module.exports = router;
