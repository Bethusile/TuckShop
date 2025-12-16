"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.fetchProductById = exports.fetchAllProducts = void 0;
// server/src/services/productService.ts
const knex_1 = __importDefault(require("../knex"));
// --- Service Logic ---
// READ ALL PRODUCTS
const fetchAllProducts = async () => {
    // Uses Knex Query Builder for readability and safety
    return (0, knex_1.default)('product')
        .select('p.itemid as productid', 'p.name', 'p.description', 'p.price', 'p.stocklevel', 'p.isactive', 'c.name as category_name')
        .from('product as p')
        .leftJoin('category as c', 'p.categoryid', 'c.categoryid')
        .orderBy('p.itemid', 'asc');
};
exports.fetchAllProducts = fetchAllProducts;
// READ ONE PRODUCT
// Returns a single Product object or undefined if not found
const fetchProductById = async (itemid) => {
    // Knex .first() method is perfect for retrieving a single row
    return (0, knex_1.default)('product')
        .select('*')
        .where({ itemid })
        .first();
};
exports.fetchProductById = fetchProductById;
// CREATE PRODUCT
const createProduct = async (productData) => {
    const [newProduct] = await (0, knex_1.default)('product')
        .insert(productData)
        .returning('*');
    return newProduct;
};
exports.createProduct = createProduct;
// UPDATE PRODUCT
const updateProduct = async (itemid, productData) => {
    const updatedCount = await (0, knex_1.default)('product')
        .where({ itemid })
        .update(productData);
    return updatedCount;
};
exports.updateProduct = updateProduct;
// DELETE PRODUCT
const deleteProduct = async (itemid) => {
    // Knex returns the number of rows affected
    const deletedCount = await (0, knex_1.default)('product').where({ itemid }).del();
    return deletedCount;
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productService.js.map