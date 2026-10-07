const fs = require("fs");

const file = "books.json";

function loadBooks()
{
    if (!fs.existsSync(file))
    {
        return [];
    }

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveBooks(books)
{
    fs.writeFileSync(file, JSON.stringify(books, null, 2));
}

module.exports = { loadBooks, saveBooks };
