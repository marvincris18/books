// Book constructor function
function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.ID = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `ID: ${this.ID} Book: ${this.title} by ${this.author} #ofPages: ${this.pages} Status: ${this.read ? "Read" : "Not yet read."}`;
    };
}

// Library module to manage books
const Library = (function() {
    let books = [];

    
    let book1 = new Book('Bible','many',4000,false);
    let book2 = new Book('Calculus','Cyrell Balmes',900,false);
    let book3 = new Book('Courtship and Relationship','Tonton Balmes',200,false);
    let book4 = new Book('Money Talks','Marvin Andrade',440,false);
    let book5 = new Book('Niche Retail Expansion','Marvin Andrade',500,true);

   
    books.push(book1,book2,book3,book4,book5);

    // Load books from localStorage if available
    function loadBooks() {
        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
            books = JSON.parse(savedBooks);
            // Reconstruct the book objects with their methods
            books = books.map(book => {
                const newBook = new Book(book.title, book.author, book.pages, book.read);
                newBook.ID = book.ID;
                return newBook;
            });
        }
    }

    // Save books to localStorage
    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function addBook(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        books.push(newBook);
        saveBooks();
        return newBook;
    }

    function getBooks() {
        return books;
    }

    function getBookById(id) {
        return books.find(book => book.ID === id);
    }

    function updateBook(id, title, author, pages, read) {
        const book = getBookById(id);
        if (book) {
            book.title = title;
            book.author = author;
            book.pages = pages;
            book.read = read;
            saveBooks();
            return true;
        }
        return false;
    }

    function deleteBook(id) {
        const index = books.findIndex(book => book.ID === id);
        if (index !== -1) {
            books.splice(index, 1);
            saveBooks();
            return true;
        }
        return false;
    }

    function toggleReadStatus(id) {
        const book = getBookById(id);
        if (book) {
            book.read = !book.read;
            saveBooks();
            return true;
        }
        return false;
    }

    function clearBooks() {
        books = [];
        localStorage.removeItem('books');
        return true;
    }

    // Initialize by loading books
    loadBooks();

    return {
        addBook,
        getBooks,
        getBookById,
        updateBook,
        deleteBook,
        toggleReadStatus,
        clearBooks
    };
})();