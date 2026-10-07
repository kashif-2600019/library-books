async function loadBooks(url = "/books")
{
    const response = await fetch(url);
    const books = await response.json();

    const container = document.getElementById("books");
    container.innerHTML = "";

    books.forEach(book =>
    {
        const div = document.createElement("div");
        div.className = "book";
        div.textContent = book.id + " - " + book.title + " - " + book.author + " - " + book.year + " - " + (book.available ? "Available" : "Borrowed");
        container.appendChild(div);
    });

    document.getElementById("message").textContent = "Books loaded.";
}

async function addBook()
{
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = Number(document.getElementById("year").value);

    const response = await fetch("/books",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, author, year, available: true })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message || "Book added.";

    if (response.ok)
    {
        loadBooks();
    }
}

function availableBooks()
{
    loadBooks("/books?available=true");
}

function searchBooks()
{
    const title = document.getElementById("search").value.trim();

    if (title)
    {
        loadBooks("/books/search?title=" + encodeURIComponent(title));
    }
    else
    {
        loadBooks();
    }
}

loadBooks();
