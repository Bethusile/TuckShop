"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMovementsHandler = exports.recordMovementHandler = void 0;
const stockMovementService = __importStar(require("../services/stockMovementService"));
// POST: Record a new stock movement (Sale, Restock, Adjustment)
const recordMovementHandler = async (req, res) => {
    try {
        const { productid, movementtype, quantitychange } = req.body;
        // Basic validation (can be enhanced with Joi/yup later)
        if (!productid || !movementtype || quantitychange === undefined) {
            res.status(400).json({ error: 'Missing required fields: productid, movementtype, or quantitychange.' });
            return;
        }
        // Delegate transaction logic to the service
        const newMovement = await stockMovementService.recordStockMovement({
            productid,
            movementtype,
            quantitychange,
        });
        res.status(201).json(newMovement);
    }
    catch (error) {
        console.error('Movement Error:', error.message);
        // Catch the error thrown from the transaction (e.g., product not found)
        if (error.message.includes('Product with ID')) {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'Failed to record stock movement due to a server error.' });
        }
    }
};
exports.recordMovementHandler = recordMovementHandler;
// GET: Retrieve all stock movement history
const getAllMovementsHandler = async (req, res) => {
    try {
        const movements = await stockMovementService.fetchAllStockMovements();
        res.json(movements);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve stock movement history.' });
    }
};
exports.getAllMovementsHandler = getAllMovementsHandler;
//# sourceMappingURL=stockMovementHandler.js.map