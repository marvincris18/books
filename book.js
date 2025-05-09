// Book class
class Book {
    constructor(title, author, pages, read) {
        this.ID = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    info() {
        return `ID: ${this.ID} Book: ${this.title} by ${this.author} #ofPages: ${this.pages} Status: ${this.read ? "Read" : "Not yet read."}`;
    }
}

// Library class to manage books
class Library {
    constructor() {
        this.books = [];
        this.loadBooks();
        
        // Initialize with default books if no books are loaded
        if (this.books.length === 0) {
            const defaultBooks = [
                new Book('Bible', 'many', 4000, false),
                new Book('Calculus', 'Cyrell Balmes', 900, false),
                new Book('Courtship and Relationship', 'Tonton Balmes', 200, false),
                new Book('Money Talks', 'Marvin Andrade', 440, false),
                new Book('Niche Retail Expansion', 'Marvin Andrade', 500, true)
            ];
            this.books.push(...defaultBooks);
        }
    }

    // Load books from localStorage if available
    loadBooks() {
        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
            const parsedBooks = JSON.parse(savedBooks);
            // Reconstruct the book objects with their methods
            this.books = parsedBooks.map(book => {
                const newBook = new Book(book.title, book.author, book.pages, book.read);
                newBook.ID = book.ID;
                return newBook;
            });
        }
    }

    // Save books to localStorage
    saveBooks() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }

    addBook(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        this.books.push(newBook);
        this.saveBooks();
        return newBook;
    }

    getBooks() {
        return this.books;
    }

    getBookById(id) {
        return this.books.find(book => book.ID === id);
    }

    updateBook(id, title, author, pages, read) {
        const book = this.getBookById(id);
        if (book) {
            book.title = title;
            book.author = author;
            book.pages = pages;
            book.read = read;
            this.saveBooks();
            return true;
        }
        return false;
    }

    deleteBook(id) {
        const index = this.books.findIndex(book => book.ID === id);
        if (index !== -1) {
            this.books.splice(index, 1);
            this.saveBooks();
            return true;
        }
        return false;
    }

    toggleReadStatus(id) {
        const book = this.getBookById(id);
        if (book) {
            book.read = !book.read;
            this.saveBooks();
            return true;
        }
        return false;
    }

    clearBooks() {
        this.books = [];
        localStorage.removeItem('books');
        return true;
    }
}

// Create a library instance
const library = new Library();