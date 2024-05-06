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