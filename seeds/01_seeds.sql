INSERT INTO users 
  (name, email, password)
VALUES
  ('Erlinda Ince', 'ErlindaBInce@teleworm.us', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Jason Hamilton', 'JasonJHamilton@armyspy.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('John Guthrie', 'JohnCGuthrie@dayrep.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Regina Simpson', 'ReginaJSimpson@jourrapide.com',
  '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties
  (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
VALUES 
  (1, 'title', 'desc', 'https://picsum.photos/300/300', 'https://picsum.photos/300/300', 100, 2, 2, 2, 'Canada', 'Street', 'city', 'province', 'post_code'),
  (2, 'title', 'desc', 'https://picsum.photos/300/300', 'https://picsum.photos/300/300', 100, 2, 2, 2, 'Canada', 'Street', 'city', 'province', 'post_code'),
  (3, 'title', 'desc', 'https://picsum.photos/300/300', 'https://picsum.photos/300/300', 100, 2, 2, 2, 'Canada', 'Street', 'city', 'province', 'post_code');

  INSERT INTO reservations
  (guest_id, property_id, start_date, end_date)
VALUES
  (1, 1, '2018-09-11', '2018-09-26'),
  (2, 2, '2019-01-04', '2019-02-01'),
  (3, 3, '2021-10-01', '2021-10-14');


INSERT INTO property_reviews
  (guest_id, property_id, reservation_id, rating, message)
VALUES
  (2, 3, 1, 3, 'message'),
  (1, 2, 1, 3, 'message'),
  (2, 3, 2, 3, 'message'),
  (3, 1, 3, 3, 'message'),
  (3, 2, 1, 3, 'message');