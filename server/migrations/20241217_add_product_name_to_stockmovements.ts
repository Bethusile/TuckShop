// server/migrations/20241217_add_product_name_to_stockmovements.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add product_name column to stockmovements to preserve product name even after deletion
    await knex.schema.alterTable('stockmovements', (table) => {
        table.string('product_name', 255).nullable();
    });
    
    // Populate existing records with current product names
    await knex.raw(`
        UPDATE stockmovements sm
        SET product_name = p.name
        FROM product p
        WHERE sm.productid = p.itemid
        AND sm.product_name IS NULL
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('stockmovements', (table) => {
        table.dropColumn('product_name');
    });
}
