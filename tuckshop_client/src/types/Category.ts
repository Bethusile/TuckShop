// tuckshop_client/src/types/Category.ts

/**
 * Interface for the Category entity, matching the database schema.
 */
export interface ICategory {
    categoryid: number;
    name: string;
}

/**
 * Interface for creating a new Category (excludes the auto-generated ID).
 */
export interface ICreateCategory {
    name: string;
}