// UI module to handle DOM interactions
const UI = (function() {
    // DOM elements
    const booksTable = document.getElementById('books-table');
    const booksTbody = document.getElementById('books-tbody');
    const emptyState = document.getElementById('empty-state');
    const addBookBtn = document.getElementById('add-book-btn');
    const clearLibraryBtn = document.getElementById('clear-library-btn');
    const modalOverlay = document.getElementById('book-modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const bookForm = document.getElementById('book-form');
    const bookIdInput = document.getElementById('book-id');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const pagesInput = document.getElementById('pages');
    const readInput = document.getElementById('read');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');

    // Error message elements
    const titleError = document.getElementById('title-error');
    const authorError = document.getElementById('author-error');
    const pagesError = document.getElementById('pages-error');

    function init() {
        // Load and display books
        displayBooks();

        // Event listeners
        addBookBtn.addEventListener('click', openAddBookModal);
        clearLibraryBtn.addEventListener('click', confirmClearLibrary);
        modalClose.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        saveBtn.addEventListener('click', saveBook);
        
        // Close modal when clicking outside
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    function displayBooks() {
        const books = Library.getBooks();
        
        // Clear previous content
        booksTbody.innerHTML = '';
        
        if (books.length === 0) {
            // Show empty state, hide table
            emptyState.style.display = 'block';
            booksTable.style.display = 'none';
            return;
        }
        
        // Show table, hide empty state
        emptyState.style.display = 'none';
        booksTable.style.display = 'table';
        
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
            booksTbody.appendChild(row);
            
            // Add event listeners to buttons
            const editBtn = row.querySelector('.edit-btn');
            const toggleBtn = row.querySelector('.toggle-btn');
            const deleteBtn = row.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', () => openEditBookModal(book.ID));
            toggleBtn.addEventListener('click', () => toggleReadStatus(book.ID));
            deleteBtn.addEventListener('click', () => confirmDeleteBook(book.ID));
        });
    }

    function openModal() {
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        resetForm();
    }

    function openAddBookModal() {
        modalTitle.textContent = 'Add New Book';
        openModal();
    }

    function openEditBookModal(bookId) {
        const book = Library.getBookById(bookId);
        if (book) {
            modalTitle.textContent = 'Edit Book';
            bookIdInput.value = book.ID;
            titleInput.value = book.title;
            authorInput.value = book.author;
            pagesInput.value = book.pages;
            readInput.checked = book.read;
            openModal();
        }
    }

    function resetForm() {
        bookForm.reset();
        bookIdInput.value = '';
        clearErrors();
    }

    function clearErrors() {
        titleError.textContent = '';
        authorError.textContent = '';
        pagesError.textContent = '';
    }

    function validateForm() {
        clearErrors();
        let isValid = true;

        if (titleInput.value.trim() === '') {
            titleError.textContent = 'Title is required';
            isValid = false;
        }

        if (authorInput.value.trim() === '') {
            authorError.textContent = 'Author is required';
            isValid = false;
        }

        if (pagesInput.value.trim() === '' || parseInt(pagesInput.value) <= 0) {
            pagesError.textContent = 'Enter a valid number of pages';
            isValid = false;
        }

        return isValid;
    }

    function saveBook() {
        if (!validateForm()) {
            return;
        }

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const pages = parseInt(pagesInput.value);
        const read = readInput.checked;
        const bookId = bookIdInput.value;

        if (bookId) {
            // Update existing book
            Library.updateBook(bookId, title, author, pages, read);
        } else {
            // Add new book
            Library.addBook(title, author, pages, read);
        }

        // Refresh the display and close modal
        displayBooks();
        closeModal();
    }

    function toggleReadStatus(bookId) {
        if (Library.toggleReadStatus(bookId)) {
            displayBooks();
        }
    }

    function confirmDeleteBook(bookId) {
        const book = Library.getBookById(bookId);
        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
            if (Library.deleteBook(bookId)) {
                displayBooks();
            }
        }
    }

    function confirmClearLibrary() {
        if (confirm('Are you sure you want to delete ALL books? This cannot be undone.')) {
            Library.clearBooks();
            displayBooks();
        }
    }

    return {
        init
    };
})();

// Initialize the UI when DOM is ready
document.addEventListener('DOMContentLoaded', UI.init);