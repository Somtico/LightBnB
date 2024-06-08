const { query } = require('../index');

const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating 
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  const whereClause = [];

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClause.push(`city LIKE $${queryParams.length}`);
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereClause.push(`owner_id = $${queryParams.length}`);
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    whereClause.push(`cost_per_night >= $${queryParams.length}`);
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    whereClause.push(`cost_per_night <= $${queryParams.length}`);
  }

  if (whereClause.length > 0) {
    queryString += ` WHERE ${whereClause.join(' AND ')}`;
  }

  queryString += `
    GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => {
      console.log('getAllProperties query error:', err.message);
      throw err;
    });
};

const addProperty = (property) => {
  const queryString = `
    INSERT INTO properties (
      owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night,
      street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const queryParams = [
    property.owner_id, property.title, property.description, property.thumbnail_photo_url,
    property.cover_photo_url, property.cost_per_night, property.street, property.city,
    property.province, property.post_code, property.country, property.parking_spaces,
    property.number_of_bathrooms, property.number_of_bedrooms
  ];

  return query(queryString, queryParams)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log('addProperty query error:', err.message);
      throw err;
    });
};

module.exports = {
  getAllProperties,
  addProperty,
};
