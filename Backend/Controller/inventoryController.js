import customError from "../Middlewares/Error.js";
import db from "../Config/dbConnection.js";


export const addSupplier = (req, res, next) => {
    const { NTN_number, email, name, categories_supplied } = req.body;

    db.beginTransaction((err) => {
        if (err) {
            return next(new customError(err.message, 500)); // Internal server error
        }

        // Check if the supplier already exists
        db.query('SELECT * FROM suppliers WHERE email = ? or NTN_number = ? ', [email, NTN_number], (err, result) => {
            if (err) {
                db.rollback(() => {
                    return next(new customError(err.message, 400)); // Bad request
                });
            }

            if (result.length > 0) {
                db.rollback();
                return next(new customError("Duplicate entry found", 409)); // Conflict
            }

            // Insert new supplier into 'suppliers' table
            db.query('INSERT INTO suppliers (NTN_number, email, name, categories_supplied) VALUES (?, ?, ?, ?)', [NTN_number, email, name, JSON.stringify(categories_supplied)], (err, insertResult) => {
                if (err) {
                    db.rollback();
                    return next(new customError(err.message, 400)); // Bad request

                }

                const supplier_id = insertResult.insertId;

                // Insert categories supplied into 'supplier_categories' table within the same transaction
                for (const category_id of categories_supplied) {
                    db.query('INSERT INTO supplier_categories (supplier_id, category_id) VALUES (?, ?)', [supplier_id, category_id], (err) => {
                        if (err) {
                            db.rollback();
                            return next(new customError(err.message, 400)); // Bad request
                        }
                    });
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        db.rollback();
                        return next(new customError(err.message, 400)); // Bad request
                    }
                    res.status(200).json({ success: true, message: 'Supplier added successfully' });
                });
            });
        });
    });
};
export const removeSupplier = (req, res, next) => {
    const { NTN_number } = req.body;

    try {
        db.beginTransaction();

        const deleteQuery = "DELETE FROM suppliers WHERE NTN_number = ? ";

        db.query(deleteQuery, [NTN_number], (err, result) => {
            if (err) {
                db.rollback();
                return next(new customError(err.message, 400))
            }
            if (result.length === 0) {
                return next(new customError("Supplier not found", 404))
            }
            db.commit();
            res.status(200).json({
                success: true,
                message: "Supplier removed successfully",
                result
            })
        })
    } catch (error) {
        return next(new customError(error.message, 400));
    }
}
// Three checks in this controller 
// 1. check if the product being added is already there  
// 2. check if the category specified exists in the category table 
// 3. check if the supplier specified supplies the particular category 
// if all three are fullfilled then product can be added otherwise it can't be added
export const addProduct = async (req, res, next) => {
    // Check if required fields are provided
    const { supplier_NTN, name, price, selling_price, image_url, category_name } = req.body;

    if (!supplier_NTN || !name || !price || !selling_price || !image_url || !category_name) {
        return next(new customError("Provide all the fields", 400))
    }
    db.beginTransaction();
    // Check if a product with the same name already exists
    const checkProductQuery = `
        SELECT *FROM products WHERE name = ?`;
    db.query(checkProductQuery, [name], async (error, productResult) => {
        if (error) {
            await db.rollback();
            return next(new customError(error.message, 400))
        }
        if (productResult.length > 0) {
            // Product with the same name already exists
            await db.rollback();
            return next(new customError("Product already exists", 400))
        }
        // Retrieve the category_id based on the provided category_name
        const getCategoryQuery = `
          SELECT category_id
          FROM categories
          WHERE name = ?
        `;
        db.query(getCategoryQuery, [category_name], async (categoryError, categoryResult) => {
            if (categoryError) {
                await db.rollback();
                return next(new customError(categoryError.message, 400))
            }
            if (categoryResult.length === 0) {
                // Category does not exist
                await db.rollback();
                return next(new customError("Provided category does not exist in the db", 400))
            }
            const category_id = categoryResult[0].category_id;




            // Check if the supplier supplies the specified category
            const checkSupplierCategoryQuery = `
            SELECT supplier_id
            FROM suppliers
            WHERE NTN_number = ?
            AND EXISTS (
              SELECT *
              FROM supplier_categories
              WHERE supplier_id = suppliers.supplier_id
              AND category_id = ?
            )`;
            db.query(checkSupplierCategoryQuery, [supplier_NTN, category_id], async (supplierError, supplierResult) => {
                if (supplierError) {
                    await db.rollback();
                    return next(new customError(supplierError.message, 400))
                }

                if (supplierResult.length === 0) {
                    // Supplier does not supply the specified category
                    await db.rollback();
                    return next(new customError("The specified supplier does not provide this category", 400))
                }

                // Insert the new product into the products table
                const insertProductQuery = `
              INSERT INTO products (supplier_NTN, name, price, selling_price, image_url, category_id,quantity)
              VALUES (?, ?, ?, ?, ?, ?,?)
            `;
                const productValues = [supplier_NTN, name, price, selling_price, image_url, category_id, 0]; //0 for quantity
                db.query(insertProductQuery, productValues, async (insertError, result) => {
                    if (insertError) {
                        console.error('Error adding product:', insertError);
                        await db.rollback();
                        return next(new customError(insertError.message, 400))
                    }
                    const productId = result.insertId;

                    await db.commit();
                    res.status(200).json({
                        success: true,
                        message: 'Product added successfully',
                    });

                });
            });
        });
    });


};
export const placeOrder = async (req, res, next) => {
    const { user_id, products } = req.body;

    try {
        // Begin a transaction
        await db.beginTransaction();

        // Insert into orders table
        const orderResult = await new Promise((resolve, reject) => {
            db.query('INSERT INTO orders (order_date, user_id) VALUES (NOW(), ?)', [user_id], (err, result) => {
                if (err) {
                    return reject(new customError(err.message, 400));
                }
                resolve(result);
            });
        });

        const orderId = orderResult.insertId;

        //use of promises for better asynchronous handling
        const insertPromises = [];
        for (const [product_id, quantity] of Object.entries(products)) {
            // Retrieve supplier NTN for the product
            const supplierNTN = await new Promise((resolve, reject) => {
                const sql = 'SELECT supplier_NTN FROM products WHERE product_id = ?';
                db.query(sql, [product_id], (err, result) => {
                    if (err) {
                        return reject(new customError(err.message, 400));
                    }
                    if (result.length === 0) {
                        return reject(new customError(`No product found for the product id: ${product_id}`, 404));
                    }
                    resolve(result[0].supplier_NTN);
                });
            });

            // Check if supplierNTN is valid (exists in suppliers table)
            const supplier_NTN = await new Promise((resolve, reject) => {
                const checkSql = 'SELECT * FROM products WHERE supplier_NTN = ?';
                db.query(checkSql, [supplierNTN], (err, result) => {
                    if (err) {
                        reject(new customError(err.message, 400));
                    }
                    if (result.length === 0) {
                        reject(null);
                    }
                    resolve(supplierNTN); // Resolve true if supplier exists, false otherwise
                });
            });

            if (!supplier_NTN) {
                return new customError(`Supplier with NTN ${supplierNTN} not found`, 404);
            }
            // Insert into order_product_details table
            const insertDetailPromise = new Promise((resolve, reject) => {
                const sql = 'INSERT INTO order_product_details (order_id, product_id, quantity, supplier_NTN) VALUES (?, ?, ?, ?)';
                db.query(sql, [orderId, product_id, quantity, supplier_NTN], (err, result) => {
                    if (err) {
                        return reject(new customError(err.message, 400));
                    }
                    resolve(result);
                });
            });
            insertPromises.push(insertDetailPromise);
        }

        // Wait for all product insertions to complete
        await Promise.all(insertPromises);
        await db.commit();
        res.status(200).json({
            success: true,
            message: 'Order placed successfully'
        });
    } catch (error) {
        await db.rollback();
        return next(new customError(error.message, 400))
    }
};

