const express = require("express");
const { loadBooks, saveBooks } = require("./books");
const logRequest = require("./logger");

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) =>
{
    logRequest(req.method, req.url);
    next();
});

app.get("/", (req, res) =>
{
    res.sendFile(__dirname + "/index.html");
});

app.get("/books/search", (req, res) =>
{
    const books = loadBooks();
    const title = (req.query.title || "").toLowerCase();

    const result = books.filter(book =>
        book.title.toLowerCase().includes(title)
    );

    res.status(200).json(result);
});

app.get("/books", (req, res) =>
{
    let books = loadBooks();

    if (req.query.available !== undefined)
    {
        const available = req.query.available === "true";
        books = books.filter(book => book.available === available);
    }

    res.status(200).json(books);
});

app.get("/books/:id", (req, res) =>
{
    const books = loadBooks();
    const id = Number(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book)
    {
        return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
});

app.post("/books", (req, res) =>
{
    const { title, author, year, available } = req.body;

    if (!title || !author || typeof year !== "number" || year < 1900 || year > 2026)
    {
        return res.status(400).json({ message: "Invalid book data" });
    }

    const books = loadBooks();
    const id = books.length > 0 ? Math.max(...books.map(x => x.id)) + 1 : 1;

    const book = {
        id,
        title,
        author,
        year,
        available: available === undefined ? true : available
    };

    books.push(book);
    saveBooks(books);

    res.status(201).json(book);
});

app.put("/books/:id", (req, res) =>
{
    const books = loadBooks();
    const id = Number(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book)
    {
        return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, year, available } = req.body;

    if (year !== undefined && (typeof year !== "number" || year < 1900 || year > 2026))
    {
        return res.status(400).json({ message: "Year must be between 1900 and 2026" });
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (year !== undefined) book.year = year;
    if (available !== undefined) book.available = available;

    saveBooks(books);
    res.status(200).json(book);
});

app.delete("/books/:id", (req, res) =>
{
    const books = loadBooks();
    const id = Number(req.params.id);
    const index = books.findIndex(x => x.id === id);

    if (index === -1)
    {
        return res.status(404).json({ message: "Book not found" });
    }

    books.splice(index, 1);
    saveBooks(books);

    res.status(200).json({ message: "Book deleted" });
});

app.put("/books/:id/borrow", (req, res) =>
{
    const books = loadBooks();
    const id = Number(req.params.id);
    const book = books.find(x => x.id === id);

    if (!book)
    {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.available)
    {
        return res.status(400).json({ message: "Book is already borrowed" });
    }

    book.available = false;
    saveBooks(books);

    res.status(200).json(book);
});

app.use(express.static(__dirname));

app.listen(port, () =>
{
    console.log("Server running at http://localhost:" + port);
});
