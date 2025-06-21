import { Request, Response } from "express";
import { Book } from "../models/books.model";
import { z } from "zod";

const CreateBookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number(),
  available: z.boolean(),
});

export const createBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = await CreateBookZodSchema.parseAsync(req.body);
    const book = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfuly",
      data: book,
    });
  } catch (error: any) {
    //got help from internet to make this generic error response
    if (error.name === "ValidationError") {
      // Mongoose validation error
      const errors: { [key: string]: any } = {};
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
    } else {
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
};

export const getAllBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const { filter, sortBy, sort, limit, skip } = req.query;
    let books: any = [];

    if (filter) {
      books = await Book.find({
        genre: filter,
      })
        .sort({ [sortBy as string]: sort === "desc" ? "desc" : "asc" })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(limit ? parseInt(limit as string) : 10);
      if (books.length === 0) {
        throw new Error(`Books not found in ${filter} genre`);
      }
    } else {
      books = await Book.find()
        .sort({ [sortBy as string]: sort === "desc" ? "desc" : "asc" })
        .skip(skip ? parseInt(skip as string) : 0)
        .limit(limit ? parseInt(limit as string) : 0);
    }

    if (books.length === 0) {
      throw new Error("Books not available");
    }

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Books retrieved failed",
      error: {
        message: error.message,
        errors: error.name,
      },
    });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);

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
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: "Book retrieved failed", error });
  }
};

export const updateBookById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
      runValidators: true,
    });

    if (book === null) {
      return res.status(404).json({
        success: false,
        message: `Book not found by (${bookId}) this id.`,
      });
    }
    await book.updateAvailability();
    res.status(201).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: "Book updated failed", error });
  }
};

export const deleteBookById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bookId = req.params.bookId;
    const deleteBook = await Book.findByIdAndDelete(bookId);
    if (!deleteBook) {
      throw new Error("Book not found by this id");
    }
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Book deletetion failed",
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

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
