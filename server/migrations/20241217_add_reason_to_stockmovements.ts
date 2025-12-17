// server/migrations/TIMESTAMP_add_reason_to_stockmovements.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('stockmovements', (table) => {
        table.text('reason').nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('stockmovements', (table) => {
        table.dropColumn('reason');
    });
}
