"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("../controllers/books.controller");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/books", books_controller_1.createBook);
exports.booksRoutes.get("/books", books_controller_1.getAllBook);
exports.booksRoutes.get("/books/:bookId", books_controller_1.getBookById);
exports.booksRoutes.patch("/books/:bookId", books_controller_1.updateBookById);
exports.booksRoutes.delete("/books/:bookId", books_controller_1.deleteBookById);
//! Delete router only usable in development mode for make life easier😊
// booksRoutes.delete("/delete-all-books", deleteAllBook)
