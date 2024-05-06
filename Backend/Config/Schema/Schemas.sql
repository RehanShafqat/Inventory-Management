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


-- CREATE TABLE products (
--   product_id INT AUTO_INCREMENT PRIMARY KEY,
--   supplier_NTN VARCHAR(20) NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   price DECIMAL(10, 2) NOT NULL,
--   selling_price DECIMAL(10, 2) NOT NULL,
--   image_url VARCHAR(1000) ,
--   category_id INT,
--   FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
-- );
