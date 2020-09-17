const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
module.exports = {
  getUserWithEmail: function (email) {
    return pool
      .query('SELECT * FROM users WHERE email = $1;', [email])
      .then((res) => res.rows[0]);
  },

  /**
   * Get a single user from the database given their id.
   * @param {string} id The id of the user.
   * @return {Promise<{}>} A promise to the user.
   */
  getUserWithId: function (id) {
    return pool
      .query('SELECT * FROM users WHERE id = $1;', [id])
      .then((res) => res.rows[0]);
  },

  /**
   * Add a new user to the database.
   * @param {{name: string, password: string, email: string}} user
   * @return {Promise<{}>} A promise to the user.
   */
  addUser: function (user) {
    const { name, email, password } = user;
    return pool.query(
      'INSERT INTO users(name, email, password) VALUES($1,$2,$3)',
      [name, email, password]
    );
  },

  /// Reservations

  /**
   * Get all reservations for a single user.
   * @param {string} guest_id The id of the user.
   * @return {Promise<[{}]>} A promise to the reservations.
   */
  getAllReservations: function (guest_id, limit = 10) {
    return pool
      .query(
        ` SELECT reservations.*, properties.*, AVG(property_reviews.rating) as average_rating
        FROM reservations
          JOIN properties ON reservations.property_id = properties.id
          JOIN property_reviews ON properties.id = property_reviews.property_id
        WHERE reservations.guest_id = $1 AND end_date < NOW()::date
        GROUP BY reservations.id, properties.id
        ORDER BY start_date
        LIMIT $2
      `,
        [guest_id, limit]
      )
      .then((res) => res.rows);
  },

  /// Properties

  /**
   * Get all properties.
   * @param {{}} options An object containing query options.
   * @param {*} limit The number of results to return.
   * @return {Promise<[{}]>}  A promise to the properties.
   */
  getAllProperties: function (options, limit = 10) {
    const queryParams = [];

    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryString += `WHERE city LIKE $${queryParams.length} `;
    }

    if (options.owner_id) {
      queryParams.push(options.owner_id);
      queryString += `AND owner_id = $${queryParams.length}`;
    }

    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      queryString += `AND properties.cost_per_night >= $${queryParams.length} `;
    }

    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      queryString += `AND properties.cost_per_night <= $${queryParams.length}`;
    }

    if (options.minimum_rating) {
      queryParams.push(options.minimum_rating);
      queryString += `AND property_reviews.rating >= $${queryParams.length} `;
    }

    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
    console.log(queryString, queryParams);

    return pool.query(queryString, queryParams).then((res) => res.rows);
  },

  /**
   * Add a property to the database
   * @param {{}} property An object containing all of the property details.
   * @return {Promise<{}>} A promise to the property.
   */
  addProperty: function (property) {
    let {
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
    } = property;

    // set value to 0 if not received
    cost_per_night ? cost_per_night : (cost_per_night = 0);
    parking_spaces ? parking_spaces : (parking_spaces = 0);
    number_of_bathrooms ? number_of_bathrooms : (number_of_bathrooms = 0);
    number_of_bedrooms ? number_of_bedrooms : (number_of_bedrooms = 0);

    return pool
      .query(
        `INSERT INTO 
        properties(owner_id, title, 
            description, thumbnail_photo_url, cover_photo_url,
            cost_per_night, street, city, province, post_code,
            country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING *;`,
        [
          owner_id,
          title,
          description,
          thumbnail_photo_url,
          cover_photo_url,
          cost_per_night,
          street,
          city,
          province,
          post_code,
          country,
          parking_spaces,
          number_of_bathrooms,
          number_of_bedrooms,
        ]
      )
      .then((res) => res.rows[0]);
  },
};
