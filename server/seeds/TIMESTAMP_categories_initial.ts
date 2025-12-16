// server/seeds/categories_initial.ts

import { Knex } from "knex";

// Comprehensive list of tuckshop / china shop categories
const categories = [
    // Drinks
    { name: 'Drinks' },
    { name: 'Energy Drinks' },
    { name: 'Water & Juices' },

    // Snacks & Food
    { name: 'Chips & Savoury Snacks' },
    { name: 'Biscuits & Cookies' },
    { name: 'Crackers & Rusks' },
    { name: 'Sweets & Chocolates' },
    { name: 'Chewing Gum & Mints' },
    { name: 'Confectionery' },

    // Fresh & Grocery
    { name: 'Fresh Vegetables' },
    { name: 'Fresh Fruit' },
    { name: 'Groceries & Pantry' },
    { name: 'Spices & Seasonings' },

    // Hot & Ready Foods
    { name: 'Hot Foods' },
    { name: 'Pies & Pastries' },
    { name: 'Sandwiches & Rolls' },
    { name: 'Ready-to-Eat Meals' },

    // Frozen & Dairy
    { name: 'Frozen Treats' },
    { name: 'Ice Cream & Lollies' },
    { name: 'Dairy & Cheese' },
    { name: 'Yoghurts & Desserts' },

    // Bakery
    { name: 'Bakery Items' },
    { name: 'Cakes & Muffins' },

    // Stationery
    { name: 'Stationery' },
    { name: 'Pens & Pencils' },
    { name: 'Books & Notebooks' },
    { name: 'Office Supplies' },
    { name: 'School Supplies' },

    // Electronics (China shop style)
    { name: 'Electronics' },
    { name: 'Phone Accessories' },
    { name: 'Chargers & Cables' },
    { name: 'Earphones & Headsets' },
    { name: 'Batteries' },
    { name: 'Small Appliances' },

    // Accessories & General
    { name: 'Accessories' },
    { name: 'Watches & Jewellery' },
    { name: 'Bags & Wallets' },
    { name: 'Sunglasses & Hats' },

    // Household & Misc
    { name: 'Cleaning Supplies' },
    { name: 'Kitchenware' },
    { name: 'Plasticware & Containers' },
    { name: 'Home Essentials' },

    // Health & Personal Care
    { name: 'Health & Personal Care' },
    { name: 'Toiletries' },
    { name: 'Cosmetics & Beauty' },

    // Seasonal & Promotions
    { name: 'Seasonal Items' },
    { name: 'Promotional Items' },
    { name: 'Miscellaneous' }
];



export async function seed(knex: Knex): Promise<void> {
    // 1. Deletes ALL existing entries in the 'category' table only.
    //    This is safe to run repeatedly and cleans up old data.
    await knex("category").del();

    // 2. Inserts all seed entries into the 'category' table.
    await knex("category").insert(categories);

    console.log(`Successfully seeded ${categories.length} categories.`);
}