import express from "express";
import {createBook} from "../controllers/books.controller"

export const booksRoutes = express.Router()

booksRoutes.post("/books", createBook)