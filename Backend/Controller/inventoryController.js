import customError from "../Middlewares/Error.js";
import db from "../Config/dbConnection.js";
import sendEmail from "../utils/Email.js";



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

export const supplierOrder = async (req, res, next) => {
    const { user_id, products } = req.body;

    try {
        // Begin a transaction
        await db.beginTransaction();

        // Insert into orders table
        const orderResult = await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO orders (order_date, user_id) VALUES (NOW(), ?)',
                [user_id],
                (err, result) => {
                    if (err) {
                        return reject(new customError(err.message, 400));
                    }
                    resolve(result);
                }
            );
        });

        const orderId = orderResult.insertId;

        // Collect products by supplier
        const productsBySupplier = {};

        for (const [product_id, quantity] of Object.entries(products)) {
            // Retrieve supplier NTN and product details
            const productResult = await new Promise((resolve, reject) => {
                const sql =
                    'SELECT p.name, p.supplier_NTN, s.email FROM products p INNER JOIN suppliers s ON p.supplier_NTN = s.NTN_number WHERE p.product_id = ?';
                db.query(sql, [product_id], (err, result) => {
                    if (err) {
                        return reject(new customError(err.message, 400));
                    }
                    if (result.length === 0) {
                        return reject(
                            new customError(`No product found for the product id: ${product_id}`, 404)
                        );
                    }
                    resolve(result[0]);
                });
            });

            const { name, supplier_NTN, email } = productResult;

            // Insert into order_product_details table
            const order_product_details = await new Promise((resolve, reject) => {
                const sql =
                    'INSERT INTO order_product_details (order_id, product_id, quantity, supplier_NTN) VALUES (?, ?, ?, ?)';
                db.query(sql, [orderId, product_id, quantity, supplier_NTN], (err, result) => {
                    if (err) {
                        return reject(new customError(err.message, 400));
                    }
                    resolve(result); // Resolve with the entire result to capture insertId
                });
            });

            const detail_id = order_product_details.insertId; // Capture the insertId

            if (!productsBySupplier[supplier_NTN]) {
                productsBySupplier[supplier_NTN] = {
                    email,
                    products: [],
                };
            }
            productsBySupplier[supplier_NTN].products.push({ product_name: name, quantity, }); // added product for same supplier 
        }
        // Send emails to suppliers
        await Promise.all(
            Object.entries(productsBySupplier).map(async ([supplier_NTN, { email, products }]) => {
                const productsListHtml = products.map(({ product_name, quantity }) => `<li>${product_name} - ${quantity}</li>`).join('');
                const link = `localhost:5000/api/version1/inventory/supplier/updateOrder/${orderId}/${supplier_NTN}`;
                // Send single email to supplier with all products
                await sendEmail(email, "Products Order Notification", `<h2>Products Order Notification</h2><p>Please supply the following products:</p> <ul>${productsListHtml}</ul>
                <b> CLICK THIS LINK FOR CONFIRMATION OF SENT <br> ${link}  </b>

                `);
            })
        );
        //commit db
        await db.commit();
        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
        });
    } catch (error) {
        db.rollback();
        return next(new customError(error.message, 400));
    }
};

export const updateSupplierOrder = (req, res, next) => {
    const { supplier_NTN, order_id } = req.params;
    if (!supplier_NTN || !order_id) {
        return next(new customError("not all values gained", 404));
    }
    db.beginTransaction();
    try {
        const query1 = "select*from order_product_details where order_id = ? and supplier_NTN = ? ";
        db.query(query1, [order_id, supplier_NTN], (err, result) => {
            if (err) {
                db.rollback();
                return next(new customError(err.message, 400))
            }
            for (const instance of result) {
                const query = "update products set quantity = quantity + ? where product_id = ?  "
                db.query(query, [instance.quantity, instance.product_id], (error, result) => {
                    if (error) {
                        db.rollback();
                        return next(new customError(error.message, 400));
                    }
                })
            }
        })
        //delete the orders_product_details for a particular supplier (the supplier has supplied all its products in a particular order .. other supplier products may not be supplied for that order)
        const deleteQuery = "delete from order_product_details where supplier_NTN = ? and order_id = ? "
        db.query(deleteQuery, [supplier_NTN, order_id], (err, result) => {
            if (err) {
                db.rollback();
                return next(new customError(err.message, 400));
            }
        })
        //check if all the suppliers have supplied their products for a particular order 
        const query3 = "select*from order_product_details where order_id = ? "
        db.query(query3, [order_id], (error, result) => {
            if (error) {
                db.rollback();
                return next(new customError(error.message, 400));
            }
            if (result.length === 0) {    //means the order is completed and all suppliers have supplied their products

                const query4 = "update orders set status = ? where order_id = ? ";
                db.query(query4, ["delivered", order_id], (error, result) => {
                    if (error) {
                        db.rollback();
                        return next(new customError(error.message, 400));
                    }
                })
                db.commit();
            }
            res.status(200).json({
                success: true,
                message: "Order Delivered successfully"
            })
        })

    } catch (error) {
        db.rollback();
        return next(new customError(error.message, 400))
    }
}
export const customerOrder = async (req, res, next) => {
    const { user_id, products } = req.body;

    try {
        // Begin a transaction
        await db.beginTransaction();

        // Insert into orders table
        const orderResult = await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO orders (order_date, user_id) VALUES (NOW(), ?)',
                [user_id],
                (err, result) => {
                    if (err) {
                        return reject(new customError(err.message, 400));
                    }
                    resolve(result);
                }
            );
        });

        const orderId = orderResult.insertId;

        // Insert products into order_product_details table
        const productEntries = Object.entries(products);
        for (const [product_id, quantity] of productEntries) {
            // Insert product details into order_product_details
            await new Promise((resolve, reject) => {
                db.query(
                    'INSERT INTO order_product_details (order_id, product_id, quantity) VALUES (?, ?, ?)',
                    [orderId, product_id, quantity],
                    (err, result) => {
                        if (err) {
                            return reject(new customError(err.message, 400));
                        }
                        resolve(result);
                    }
                );
            });
        }

        // Commit the transaction
        await db.commit();

        res.status(200).json({
            success: true,
            message: 'Order placed successfully',
            order_id: orderId
        });
    } catch (error) {
        // Rollback transaction on error
        await db.rollback();
        return next(new customError(error.message, 400));
    }
};
export const updateCustomerOrder = async (req, res, next) => {
    const { order_id, status } = req.body;

    try {
        // Validate the status value against enum types defined in the database schema
        const validStatusValues = ['pending', 'confirmed', 'shipped', 'delivered'];
        if (!validStatusValues.includes(status)) {
            return next(new customError(`Invalid status value: ${status}. Allowed values: ${validStatusValues.join(', ')}`, 400));
        }

        // Begin a transaction
        await db.beginTransaction();

        // Update the status of the order in the database
        const updateOrderStatusQuery = `
            UPDATE orders
            SET status = ?
            WHERE order_id = ?
        `;
        await new Promise((resolve, reject) => {
            db.query(updateOrderStatusQuery, [status, order_id], (err, result) => {
                if (err) {
                    return next(new customError(err.message, 400));
                }
                resolve(result);
            });
        });

        // Commit the transaction
        await db.commit();

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order_id: order_id,
            new_status: status
        });
    } catch (error) {
        await db.rollback();
        return next(new customError(error.message, 400));
    }
};

export const getSoldData = async (req, res, next) => {
    db.query(
        "SELECT c.name AS category_name, SUM(opd.quantity) AS total_sold " +
        "FROM order_product_details opd " +
        "JOIN products p ON opd.product_id = p.product_id " +
        "JOIN categories c ON p.category_id = c.category_id " +
        "JOIN orders o ON opd.order_id = o.order_id " +
        "WHERE o.status = 'delivered' " +
        "GROUP BY c.name " +
        "ORDER BY total_sold DESC " +
        "LIMIT 10",
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(results);
            }
        }
    );
}