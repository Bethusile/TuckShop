// server/migrations/TIMESTAMP_initial_tuckshop_schema.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. CATEGORY Table
    await knex.schema.createTable('category', (table) => {
        table.increments('categoryid').primary();
        table.string('name', 100).notNullable().unique();
    });

    // 2. PRODUCT Table
    await knex.schema.createTable('product', (table) => {
        table.increments('itemid').primary();
        table.string('name', 255).notNullable();
        table.text('description');
        table.decimal('price', 10, 2).notNullable();
        table.integer('stocklevel').notNullable().defaultTo(0);
        table.boolean('isactive').notNullable().defaultTo(true);
        
        // Foreign Key: links to category table
        table.integer('categoryid')
            .references('categoryid')
            .inTable('category')
            .onDelete('SET NULL');
    });

    // 3. STOCK MOVEMENTS Table
    await knex.schema.createTable('stockmovements', (table) => {
        table.increments('movementid').primary();
        
        // Foreign Key: links to product table
        table.integer('productid')
            .notNullable()
            .references('itemid')
            .inTable('product')
            .onDelete('CASCADE');
            
        table.string('movementtype', 50).notNullable();
        table.integer('quantitychange').notNullable();
        table.timestamp('movementtimestamp', { useTz: true }).defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    // Drop tables in reverse order to respect foreign key constraints
    await knex.schema.dropTableIfExists('stockmovements');
    await knex.schema.dropTableIfExists('product');
    await knex.schema.dropTableIfExists('category');
}