// server/seeds/TIMESTAMP_initial_data.ts
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries in the tables (optional, but good practice)
    await knex("stockmovements").del();
    await knex("product").del();
    await knex("category").del(); // Must delete in reverse order due to foreign keys

    // Inserts seed entries
    // 1. Categories
    await knex("category").insert([
        { categoryid: 1, name: "Drinks" }, 
        { categoryid: 2, name: "Snacks" }, 
        { categoryid: 3, name: "Sweets" }
    ]);
    
    // 2. Products (references the Category IDs above)
    await knex("product").insert([
        { name: 'Coke 330ml', description: 'Classic canned Coke', price: 15.00, stocklevel: 50, categoryid: 1 },
        { name: 'Biltong Pouch', description: 'Dried seasoned meat', price: 45.50, stocklevel: 20, categoryid: 2 },
        { name: 'Choc Bar', description: 'Milk chocolate candy bar', price: 12.00, stocklevel: 100, categoryid: 3 }
    ]);
};