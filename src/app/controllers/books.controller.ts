import { Request, Response } from "express";
import { Book } from "../models/books.model";

export const createBook = async (req: Request, res: Response) => {

    const body = req.body
    try {
        if (typeof body.copies !== 'number'){
            res.status(400).json({
                message: "Validation failed"
            })
        }
    const note = await Book.create(body)

    res.status(201).json({
        success: true,
        message: "Book created successfuly",
        data: note
    })
    } catch (error) {
        res.status(500).json({
            message: "Validation failed",
            success: false,
            error
        })
    }
};