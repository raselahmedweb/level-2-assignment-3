import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./app/routers/books.route";
import { borrowsRoutes } from "./app/routers/borrows.route";

const app: Application = express();

app.use(express.json());

app.use("/api", booksRoutes)
app.use("/api", borrowsRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Library Management API');
});


// 404 route
app.use((req: Request, res: Response) => {
    res.status(404).json({message: "404 not found", success: false});
});


export default app;