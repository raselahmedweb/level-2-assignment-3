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
exports.deleteBookById = exports.updateBookById = exports.getBookById = exports.getAllBook = exports.createBook = void 0;
const books_model_1 = require("../models/books.model");
const zod_1 = require("zod");
const CreateBookZodSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number(),
    available: zod_1.z.boolean(),
});
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield CreateBookZodSchema.parseAsync(req.body);
        const book = yield books_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfuly",
            data: book,
        });
    }
    catch (error) {
        //got help from internet to make this generic error response
        if (error.name === "ValidationError") {
            // Mongoose validation error
            const errors = {};
            for (const field in error.errors) {
                if (error.errors.hasOwnProperty(field)) {
                    const validationError = error.errors[field];
                    errors[field] = {
                        message: validationError.message,
                        name: validationError.name,
                        properties: validationError.properties,
                        kind: validationError.kind,
                        path: validationError.path,
                        value: validationError.value,
                    };
                }
            }
            res.status(400).json({
                // Use 400 for bad request (validation errors)
                message: "Validation failed",
                success: false,
                error: {
                    name: error.name,
                    errors: errors,
                },
            });
        }
        else {
            res.status(500).json({
                message: "An unexpected error occurred", // More generic message for non-validation errors
                success: false,
                error: {
                    message: error.message,
                    name: error.name,
                },
            });
        }
    }
});
exports.createBook = createBook;
const getAllBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy, sort, limit, skip } = req.query;
        let books = [];
        if (filter) {
            books = yield books_model_1.Book.find({
                genre: filter,
            })
                .sort({ [sortBy]: sort === "desc" ? "desc" : "asc" })
                .skip(skip ? parseInt(skip) : 0)
                .limit(limit ? parseInt(limit) : 10);
            if (books.length === 0) {
                throw new Error(`Books not found in ${filter} genre`);
            }
        }
        else {
            books = yield books_model_1.Book.find()
                .sort({ [sortBy]: sort === "desc" ? "desc" : "asc" })
                .skip(skip ? parseInt(skip) : 0)
                .limit(limit ? parseInt(limit) : 0);
        }
        if (books.length === 0) {
            throw new Error("Books not available");
        }
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Books retrieved failed",
            error: {
                message: error.message,
                errors: error.name,
            },
        });
    }
});
exports.getAllBook = getAllBook;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const book = yield books_model_1.Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book not found by (${bookId}) this id.`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res
            .status(400)
            .json({ success: false, message: "Book retrieved failed", error });
    }
});
exports.getBookById = getBookById;
const updateBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const updatedBody = req.body;
        const book = yield books_model_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
            runValidators: true,
        });
        if (book === null) {
            return res.status(404).json({
                success: false,
                message: `Book not found by (${bookId}) this id.`,
            });
        }
        yield book.updateAvailability();
        res.status(201).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        res
            .status(400)
            .json({ success: false, message: "Book updated failed", error });
    }
});
exports.updateBookById = updateBookById;
const deleteBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const deleteBook = yield books_model_1.Book.findByIdAndDelete(bookId);
        if (!deleteBook) {
            throw new Error("Book not found by this id");
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Book deletetion failed",
            error: {
                name: error.name,
                message: error.message,
            },
        });
    }
});
exports.deleteBookById = deleteBookById;
//! deleting all
// export const deleteAllBook = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const deleteBooks = await Book.deleteMany();
//     res.status(200).json({
//       success: true,
//       message: "All Books deleted successfully",
//       data: deleteBooks,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Books deletetion failed",
//       error,
//     });
//   }
// };
