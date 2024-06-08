const { query } = require('../index');

const getUserWithEmail = (email) => {
  return query('SELECT * FROM users WHERE email = $1', [email])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      console.log('getUserWithEmail query error:', err.message);
      throw err;
    });
};

const getUserWithId = (id) => {
  return query('SELECT * FROM users WHERE id = $1', [id])
    .then((result) => result.rows[0] || null)
    .catch((err) => {
      console.log('getUserWithId query error:', err.message);
      throw err;
    });
};

const addUser = (user) => {
  const values = [user.name, user.email, user.password];
  return query('INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *;', values)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log('addUser query error:', err.message);
      throw err;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
};
