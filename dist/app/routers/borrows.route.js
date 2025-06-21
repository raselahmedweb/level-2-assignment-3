"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrows_controller_1 = require("../controllers/borrows.controller");
exports.borrowsRoutes = express_1.default.Router();
exports.borrowsRoutes.post("/borrow", borrows_controller_1.borrowBook);
exports.borrowsRoutes.get("/borrow", borrows_controller_1.getBorrowedBooksSummary);
