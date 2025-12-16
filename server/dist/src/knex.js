"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/knex.ts
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("../knexfile")); // Correct path to knexfile.ts
// Export the development configuration
const db = (0, knex_1.default)(knexfile_1.default.development);
exports.default = db;
//# sourceMappingURL=knex.js.map