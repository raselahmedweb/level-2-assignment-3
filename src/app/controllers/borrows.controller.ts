import { Request, Response } from "express";
import { Book } from "../models/books.model";
import { Borrow } from "../models/borrows.model";

export const borrowBook = async (req: Request, res: Response): Promise<any> => {
  try {
    const body: any = req.body;
    if (!body.quantity || parseInt(body.quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive number.",
      });
    }
    const book = await Book.findById(body.book);
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
    await book.updateAvailability();

    const borrowRecord = await Borrow.create(body);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully.",
      data: borrowRecord,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Borrowing failed.",
      error: {
        message: error.message,
        errors: error.name,
      },
    });
  }
};


//
export const getBorrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve borrowed books summary',
      error: error.message,
    });
  }
};
