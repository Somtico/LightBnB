const { query } = require('../index');

const getAllReservations = (guest_id, limit = 10) => {
  const queryString = `
    SELECT properties.*, reservations.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    JOIN reservations ON properties.id = reservations.property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;

  return query(queryString, [guest_id, limit])
    .then((result) => result.rows)
    .catch((err) => {
      console.log('getAllReservations query error:', err.message);
      throw err;
    });
};

module.exports = {
  getAllReservations,
};
