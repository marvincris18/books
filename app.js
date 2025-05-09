// UI class to handle DOM interactions
class UI {
    constructor(libraryInstance) {
        // Store reference to library instance
        this.library = libraryInstance;
        
        // DOM elements
        this.booksTable = document.getElementById('books-table');
        this.booksTbody = document.getElementById('books-tbody');
        this.emptyState = document.getElementById('empty-state');
        this.addBookBtn = document.getElementById('add-book-btn');
        this.clearLibraryBtn = document.getElementById('clear-library-btn');
        this.modalOverlay = document.getElementById('book-modal-overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalClose = document.getElementById('modal-close');
        this.bookForm = document.getElementById('book-form');
        this.bookIdInput = document.getElementById('book-id');
        this.titleInput = document.getElementById('title');
        this.authorInput = document.getElementById('author');
        this.pagesInput = document.getElementById('pages');
        this.readInput = document.getElementById('read');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.saveBtn = document.getElementById('save-btn');

        // Error message elements
        this.titleError = document.getElementById('title-error');
        this.authorError = document.getElementById('author-error');
        this.pagesError = document.getElementById('pages-error');
        
        // Bind the methods to the instance
        this.openAddBookModal = this.openAddBookModal.bind(this);
        this.confirmClearLibrary = this.confirmClearLibrary.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveBook = this.saveBook.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);
    }

    init() {
        // Load and display books
        this.displayBooks();

        // Event listeners
        this.addBookBtn.addEventListener('click', this.openAddBookModal);
        this.clearLibraryBtn.addEventListener('click', this.confirmClearLibrary);
        this.modalClose.addEventListener('click', this.closeModal);
        this.cancelBtn.addEventListener('click', this.closeModal);
        this.saveBtn.addEventListener('click', this.saveBook);
        
        // Close modal when clicking outside
        this.modalOverlay.addEventListener('click', this.handleModalClick);
    }

    handleModalClick(e) {
        if (e.target === this.modalOverlay) {
            this.closeModal();
        }
    }

    displayBooks() {
        const books = this.library.getBooks();
        
        // Clear previous content
        this.booksTbody.innerHTML = '';
        
        if (books.length === 0) {
            // Show empty state, hide table
            this.emptyState.style.display = 'block';
            this.booksTable.style.display = 'none';
            return;
        }
        
        // Show table, hide empty state
        this.emptyState.style.display = 'none';
        this.booksTable.style.display = 'table';
        
        // Create table rows
        books.forEach(book => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.pages}</td>
                <td><span class="status-badge ${book.read ? 'read' : 'not-read'}">
                    ${book.read ? 'Read' : 'Not read'}
                </span></td>
                <td class="actions">
                    <button class="btn-primary edit-btn" data-id="${book.ID}">Edit</button>
                    <button class="btn-warning toggle-btn" data-id="${book.ID}">
                        ${book.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                    <button class="btn-danger delete-btn" data-id="${book.ID}">Delete</button>
                </td>
            `;
            this.booksTbody.appendChild(row);
            
            // Add event listeners to buttons
            const editBtn = row.querySelector('.edit-btn');
            const toggleBtn = row.querySelector('.toggle-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => this.openEditBookModal(book.ID));
            toggleBtn.addEventListener('click', () => this.toggleReadStatus(book.ID));
            deleteBtn.addEventListener('click', () => this.confirmDeleteBook(book.ID));
        });
    }

    openModal() {
        this.modalOverlay.classList.add('active');
    }

    closeModal() {
        this.modalOverlay.classList.remove('active');
        this.resetForm();
    }

    openAddBookModal() {
        this.modalTitle.textContent = 'Add New Book';
        this.openModal();
    }

    openEditBookModal(bookId) {
        const book = this.library.getBookById(bookId);
        if (book) {
            this.modalTitle.textContent = 'Edit Book';
            this.bookIdInput.value = book.ID;
            this.titleInput.value = book.title;
            this.authorInput.value = book.author;
            this.pagesInput.value = book.pages;
            this.readInput.checked = book.read;
            this.openModal();
        }
    }

    resetForm() {
        this.bookForm.reset();
        this.bookIdInput.value = '';
        this.clearErrors();
    }

    clearErrors() {
        this.titleError.textContent = '';
        this.authorError.textContent = '';
        this.pagesError.textContent = '';
    }

    validateForm() {
        this.clearErrors();
        let isValid = true;

        if (this.titleInput.value.trim() === '') {
            this.titleError.textContent = 'Title is required';
            isValid = false;
        }

        if (this.authorInput.value.trim() === '') {
            this.authorError.textContent = 'Author is required';
            isValid = false;
        }

        if (this.pagesInput.value.trim() === '' || parseInt(this.pagesInput.value) <= 0) {
            this.pagesError.textContent = 'Enter a valid number of pages';
            isValid = false;
        }

        return isValid;
    }

    saveBook() {
        if (!this.validateForm()) {
            return;
        }

        const title = this.titleInput.value.trim();
        const author = this.authorInput.value.trim();
        const pages = parseInt(this.pagesInput.value);
        const read = this.readInput.checked;
        const bookId = this.bookIdInput.value;

        if (bookId) {
            // Update existing book
            this.library.updateBook(bookId, title, author, pages, read);
        } else {
            // Add new book
            this.library.addBook(title, author, pages, read);
        }

        // Refresh the display and close modal
        this.displayBooks();
        this.closeModal();
    }

    toggleReadStatus(bookId) {
        if (this.library.toggleReadStatus(bookId)) {
            this.displayBooks();
        }
    }

    confirmDeleteBook(bookId) {
        const book = this.library.getBookById(bookId);
        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
            if (this.library.deleteBook(bookId)) {
                this.displayBooks();
            }
        }
    }

    confirmClearLibrary() {
        if (confirm('Are you sure you want to delete ALL books? This cannot be undone.')) {
            this.library.clearBooks();
            this.displayBooks();
        }
    }
}

// Initialize the UI when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create library instance
    const library = new Library();
    
    // Create UI instance with library reference
    const ui = new UI(library);
    ui.init();
});