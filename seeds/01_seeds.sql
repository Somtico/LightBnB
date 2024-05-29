-- Insert data into users table
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Jane Smith', 'jane@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Alice Johnson', 'alice@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- Insert data into properties table
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) VALUES
(1, 'Cozy Cottage', 'description', 'http://example.com/thumb1.jpg', 'http://example.com/cover1.jpg', 100, 2, 1, 2, 'Canada', '123 Maple St', 'Saskatoon', 'SK', 'S7K1A1', TRUE),
(2, 'Modern Apartment', 'description', 'http://example.com/thumb2.jpg', 'http://example.com/cover2.jpg', 150, 1, 1, 1, 'Canada', '456 Oak St', 'Regina', 'SK', 'S4P3X1', TRUE),
(3, 'Luxury Villa', 'description', 'http://example.com/thumb3.jpg', 'http://example.com/cover3.jpg', 300, 3, 2, 4, 'Canada', '789 Pine St', 'Calgary', 'AB', 'T2N1N4', FALSE);

-- Insert data into reservations table
INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES
('2024-06-01', '2024-06-07', 1, 2),
('2024-07-15', '2024-07-20', 2, 3),
('2024-08-10', '2024-08-15', 3, 1);

-- Insert data into property_reviews table
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES
(2, 1, 1, 5, 'message'),
(3, 2, 2, 4, 'message'),
(1, 3, 3, 3, 'message');
