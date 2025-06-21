"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_route_1 = require("./app/routers/books.route");
const borrows_route_1 = require("./app/routers/borrows.route");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", books_route_1.booksRoutes);
app.use("/api", borrows_route_1.borrowsRoutes);
app.get('/', (req, res) => {
    res.send('Library Management API');
});
// 404 route
app.use((req, res) => {
    res.status(404).json({ message: "404 not found", success: false });
});
exports.default = app;
