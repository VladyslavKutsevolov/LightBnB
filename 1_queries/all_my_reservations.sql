SELECT
  properties.*,
  reservations.*,
  AVG(property_reviews.rating) AS average_rating
FROM reservations
  JOIN property_reviews ON property_reviews.property_id = reservations.id
  JOIN properties ON reservations.property_id = properties.id
WHERE reservations.guest_id = 1 AND reservations.end_date < NOW()::DATE
GROUP BY 
  reservations.id,
  property_reviews.id,
  properties.id
ORDER BY reservations.start_date
LIMIT 10;