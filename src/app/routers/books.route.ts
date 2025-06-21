import express from "express";
import {
  createBook,
  deleteBookById,
  getAllBook,
  getBookById,
  updateBookById,
} from "../controllers/books.controller";

export const booksRoutes = express.Router();

booksRoutes.post("/books", createBook);
booksRoutes.get("/books", getAllBook);
booksRoutes.get("/books/:bookId", getBookById);
booksRoutes.patch("/books/:bookId", updateBookById);
booksRoutes.delete("/books/:bookId", deleteBookById);

//! Delete router only usable in development mode for make life easier😊
// booksRoutes.delete("/delete-all-books", deleteAllBook)
