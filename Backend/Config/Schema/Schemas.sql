-- CREATE TABLE suppliers (
--   supplier_id INT AUTO_INCREMENT PRIMARY KEY,
--   NTN_number VARCHAR(20) UNIQUE NOT NULL,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   categories_supplied JSON
-- );

-- -- Create the supplier_categories table with ON DELETE CASCADE
-- CREATE TABLE supplier_categories (
--   supplier_id INT,
--   category_id INT,
--   PRIMARY KEY (supplier_id, category_id),
--   FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
--   FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
-- );

-- CREATE TABLE categories (
--   category_id INT AUTO_INCREMENT PRIMARY KEY,
--   name VARCHAR(255) NOT NULL
-- );

