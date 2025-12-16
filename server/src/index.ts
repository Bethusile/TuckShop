// server/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db'; 

const app = express();
const port = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ======================
// 🛒 PRODUCT ROUTES 🛒 (Table: Product)
// ======================

// 1. CREATE a Product (POST /products)
app.post('/products', async (req: Request, res: Response) => {
    try {
        const { name, description, price, stocklevel, isactive, categoryid } = req.body;
        
        const newProduct = await pool.query(
            "INSERT INTO product (name, description, price, stocklevel, isactive, categoryid) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, description, price, stocklevel, isactive, categoryid]
        );
        res.json(newProduct.rows[0]);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on CREATE product");
    }
});

// 2. GET all Products (READ /products)
app.get('/products', async (req: Request, res: Response) => {
    try {
        const allProducts = await pool.query(
            `SELECT 
                p.itemid, p.name, p.description, p.price, p.stocklevel, p.isactive, 
                c.name AS category_name
             FROM product p
             JOIN category c ON p.categoryid = c.categoryid
             ORDER BY p.itemid ASC`
        );
        res.json(allProducts.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on READ all products");
    }
});

// 3. GET a specific Product (READ ONE /products/:id)
app.get('/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await pool.query("SELECT * FROM product WHERE itemid = $1", [id]);

        if (product.rows.length === 0) {
            return res.status(404).json("Product not found");
        }
        res.json(product.rows[0]);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on READ one product");
    }
});

// 4. UPDATE a Product (PUT /products/:id)
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, stocklevel, isactive, categoryid } = req.body;
        
        await pool.query(
            "UPDATE product SET name = $1, description = $2, price = $3, stocklevel = $4, isactive = $5, categoryid = $6 WHERE itemid = $7",
            [name, description, price, stocklevel, isactive, categoryid, id]
        );
        res.json("Product was updated!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on UPDATE product");
    }
});

// 5. DELETE a Product (DELETE /products/:id)
app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM product WHERE itemid = $1", [id]);
        res.json("Product was successfully deleted!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on DELETE product");
    }
});


// ======================
// 🔖 CATEGORY ROUTES 🔖 (Table: Category)
// ======================

// 6. CREATE a Category (POST /categories)
app.post('/categories', async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const newCategory = await pool.query(
            "INSERT INTO category (name) VALUES($1) RETURNING *",
            [name]
        );
        res.json(newCategory.rows[0]);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on CREATE category");
    }
});

// 7. GET all Categories (READ /categories)
app.get('/categories', async (req: Request, res: Response) => {
    try {
        const allCategories = await pool.query("SELECT * FROM category ORDER BY categoryid ASC");
        res.json(allCategories.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on READ all categories");
    }
});

// 8. UPDATE a Category (PUT /categories/:id)
app.put('/categories/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        await pool.query(
            "UPDATE category SET name = $1 WHERE categoryid = $2",
            [name, id]
        );
        res.json("Category was updated!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on UPDATE category");
    }
});

// 9. DELETE a Category (DELETE /categories/:id)
app.delete('/categories/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM category WHERE categoryid = $1", [id]);
        res.json("Category was successfully deleted!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on DELETE category");
    }
});


// ======================================
// 📊 STOCK MOVEMENTS ROUTES 📊 (Table: StockMovements)
// ======================================

// 10. CREATE a Stock Movement (POST /movements) - Records a sale, restock, or adjustment
app.post('/movements', async (req: Request, res: Response) => {
    try {
        const { productid, movementtype, quantitychange } = req.body;
        
        // 1. Record the movement
        const newMovement = await pool.query(
            "INSERT INTO stockmovements (productid, movementtype, quantitychange, movementtimestamp) VALUES($1, $2, $3, NOW()) RETURNING *",
            [productid, movementtype, quantitychange]
        );
        
        // 2. Update the StockLevel in the Product table (CRITICAL STEP)
        // If it's a sale, quantitychange is negative. If restock, positive.
        await pool.query(
            "UPDATE product SET stocklevel = stocklevel + $1 WHERE itemid = $2",
            [quantitychange, productid]
        );

        res.json(newMovement.rows[0]);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on CREATE stock movement and update product stock");
    }
});

// 11. GET all Stock Movements (READ /movements) - View transaction history
app.get('/movements', async (req: Request, res: Response) => {
    try {
        // Joins with Product table to show the product name with the movement
        const allMovements = await pool.query(
            `SELECT 
                sm.movementid, sm.movementtype, sm.quantitychange, sm.movementtimestamp,
                p.name AS product_name
             FROM stockmovements sm
             JOIN product p ON sm.productid = p.itemid
             ORDER BY sm.movementtimestamp DESC`
        );
        res.json(allMovements.rows);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error on READ all stock movements");
    }
});
// START SERVER
app.listen(port, () => {
    console.log(`Tuckshop TypeScript Server is running on http://localhost:${port}`);
});