"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowedBooksSummary = exports.borrowBook = void 0;
const books_model_1 = require("../models/books.model");
const borrows_model_1 = require("../models/borrows.model");
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body.quantity || parseInt(body.quantity) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive number.",
            });
        }
        const book = yield books_model_1.Book.findById(body.book);
        if (!book) {
            return res
                .status(404)
                .json({ success: false, message: "Book not found." });
        }
        if (book.copies < parseInt(body.quantity)) {
            return res
                .status(400)
                .json({ success: false, message: "Not enough copies available." });
        }
        book.copies = book.copies - parseInt(body.quantity);
        yield book.updateAvailability();
        const borrowRecord = yield borrows_model_1.Borrow.create(body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully.",
            data: borrowRecord,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Borrowing failed.",
            error: {
                message: error.message,
                errors: error.name,
            },
        });
    }
});
exports.borrowBook = borrowBook;
//
const getBorrowedBooksSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrows_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookDetails',
                },
            },
            {
                $unwind: '$bookDetails',
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: '$bookDetails.title',
                        isbn: '$bookDetails.isbn',
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summary,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve borrowed books summary',
            error: error.message,
        });
    }
});
exports.getBorrowedBooksSummary = getBorrowedBooksSummary;
