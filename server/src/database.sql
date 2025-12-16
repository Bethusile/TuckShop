-- FILE: database.sql
-- Description: Schema for the Tuckshop Inventory and Stock Movement application.

-- Ensure a clean slate by dropping tables if they exist (USE CAUTION IN PRODUCTION)
DROP TABLE IF EXISTS stockmovements;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;


-- 1. CATEGORY Table
-- PK: CategoryID
CREATE TABLE category (
    categoryid SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. PRODUCT Table
-- PK: ItemID
-- FK: CategoryID references category(categoryid)
CREATE TABLE product (
    itemid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL, -- Stored as a decimal number
    stocklevel INT NOT NULL DEFAULT 0,
    isactive BOOLEAN NOT NULL DEFAULT TRUE,
    categoryid INT,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_category
        FOREIGN KEY (categoryid)
        REFERENCES category (categoryid)
        ON DELETE SET NULL -- If a category is deleted, products in it remain but their categoryid is set to NULL
);

-- 3. STOCK MOVEMENTS Table
-- PK: MovementID
-- FK: ProductID references product(itemid)
CREATE TABLE stockmovements (
    movementid SERIAL PRIMARY KEY,
    productid INT NOT NULL,
    -- MovementType could be 'SALE', 'RESTOCK', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT'
    movementtype VARCHAR(50) NOT NULL,
    -- QuantityChange is the amount added (positive) or removed (negative)
    quantitychange INT NOT NULL,
    movementtimestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_product
        FOREIGN KEY (productid)
        REFERENCES product (itemid)
        ON DELETE CASCADE -- If a product is deleted, its movement history is also deleted
);

-- 💡 Initial Data (Optional - useful for testing)
INSERT INTO category (name) VALUES ('Drinks'), ('Snacks'), ('Sweets');

INSERT INTO product (name, description, price, stocklevel, categoryid) VALUES 
('Coke 330ml', 'Classic canned Coke', 15.00, 50, 1),
('Biltong Pouch', 'Dried seasoned meat', 45.50, 20, 2),
('Choc Bar', 'Milk chocolate candy bar', 12.00, 100, 3);