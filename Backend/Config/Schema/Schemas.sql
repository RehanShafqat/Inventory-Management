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
--   quantity INT NOT NULL,
--   FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
--   FOREIGN KEY (supplier_NTN) REFERENCES suppliers(NTN_number) ON DELETE CASCADE
-- );



-- CREATE TABLE orders (
--   order_id INT AUTO_INCREMENT PRIMARY KEY,
--   order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   user_id INT,         -- Foreign key referencing the users table for customers/admins
--   status ENUM('pending', 'confirmed', 'shipped', 'delivered') DEFAULT 'pending',
--   FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
-- );





-- CREATE TABLE order_product_details (
--   detail_id INT AUTO_INCREMENT PRIMARY KEY,
--   order_id INT,          -- Foreign key referencing the orders table
--   product_id INT,        -- Foreign key referencing the products table
--   quantity INT,          -- Quantity of the product ordered
--   supplier_NTN varchar(255),       -- Foreign key referencing the suppliers table
--   FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
--   FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
--   FOREIGN KEY (supplier_NTN) REFERENCES suppliers(NTN_number) ON DELETE CASCADE
-- );