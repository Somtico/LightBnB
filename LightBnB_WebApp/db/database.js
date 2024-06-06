const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `
    SELECT * 
    FROM users
    WHERE email = $1;
  `;

  return pool
    .query(queryString, [email])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("getUserWithEmail query error:", err.message);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `
    SELECT * 
    FROM users
    WHERE id = $1;
  `;

  return pool
    .query(queryString, [id])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log("getUserWithId query error:", err.message);
      throw err;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `
    INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return pool
    .query(queryString, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("addUser query error:", err.message);
      throw err;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `
    SELECT * 
    FROM properties
    JOIN reservations ON properties.id = property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    LIMIT $2;
    `;

  return pool
    .query(queryString, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log("getAllReservations query error:", err.message);
      throw err;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
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

  if(options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    whereClause.push(`cost_per_night >= $${queryParams.length}`)
  }

  if(options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    whereClause.push(`cost_per_night <= $${queryParams.length}`)
  }

  if(whereClause.length > 0) {
    queryString += `  WHERE ${whereClause.join(' AND ')}`;
  }

  queryString += `
  GROUP BY properties.id
  `;

  if(options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log("getAllProperties query error:", err.message);
      throw err;
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
