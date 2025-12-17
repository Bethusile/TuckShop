// server/migrations/20241217_fix_stockmovements_cascade.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Drop the existing foreign key constraint with CASCADE
    await knex.schema.alterTable('stockmovements', (table) => {
        table.dropForeign(['productid']);
    });
    
    // Make productid nullable to allow SET NULL
    await knex.schema.alterTable('stockmovements', (table) => {
        table.integer('productid').nullable().alter();
    });
    
    // Re-add the foreign key with SET NULL instead of CASCADE
    await knex.schema.alterTable('stockmovements', (table) => {
        table.foreign('productid')
            .references('itemid')
            .inTable('product')
            .onDelete('SET NULL');
    });
}

export async function down(knex: Knex): Promise<void> {
    // Revert back to CASCADE behavior
    await knex.schema.alterTable('stockmovements', (table) => {
        table.dropForeign(['productid']);
    });
    
    await knex.schema.alterTable('stockmovements', (table) => {
        table.integer('productid').notNullable().alter();
    });
    
    await knex.schema.alterTable('stockmovements', (table) => {
        table.foreign('productid')
            .references('itemid')
            .inTable('product')
            .onDelete('CASCADE');
    });
}
