import { Model, model, Schema } from "mongoose";
import { BookInstanceMethods, IBook } from "../interfaces/books.interface";

const bookSchema = new Schema<IBook, Model<IBook>, BookInstanceMethods>(
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
      required: true,
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
      min: [0, "Copies must be a positive number"],
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

bookSchema.pre("save", function () {
  this.available = this.copies > 0;
});

bookSchema.post("save", function (doc) {
  console.log(`Book ${doc.title} was created successfully.`);
});

bookSchema.method("updateAvailability", async function () {
  this.available = this.copies > 0;
  await this.save();
});

export const Book = model("Books", bookSchema);
