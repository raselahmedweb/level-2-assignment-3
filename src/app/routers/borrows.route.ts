import express from "express";
import { borrowBook, getBorrowedBooksSummary } from "../controllers/borrows.controller";

export const borrowsRoutes = express.Router()

borrowsRoutes.post("/borrow", borrowBook)
borrowsRoutes.get("/borrow", getBorrowedBooksSummary)