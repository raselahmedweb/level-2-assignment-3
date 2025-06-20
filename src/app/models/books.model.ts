import { model, Schema } from "mongoose";
import { IBook } from "../interfaces/books.interface";

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    description: { type: String },
    copies: {
      type: Number,
      required: true,
      min: [0, "Copies cannot be negative"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Book = model<IBook>("Books", bookSchema);
