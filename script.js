/* javascript */

function Book(title,author,pages, read){
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
      }
    this.ID = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return `ID: ${this.ID} Book: ${this.title} by ${this.author} #ofPages: ${this.pages} Status: ${this.read?"Read":"Not yet read."}`;
    };
}

let book1 = new Book('Bible','many',4000,false);
let book2 = new Book('Calculus','Cyrell Balmes',900,false);
let book3 = new Book('Courtship and Relationship','Tonton Balmes',200,false);
let book4 = new Book('Money Talks','Marvin Andrade',440,false);
let book5 = new Book('Niche Retail Expansion','Marvin Andrade',500,true);

const books=[];
books.push(book1,book2,book3,book4,book5);


const div = document.querySelector('.container');

// Create the table
const table = document.createElement('table');
table.innerHTML = `
  <thead>
    <tr>
      <th>Title</th>
      <th>Author</th>
      <th># of Pages</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody></tbody>
`;

const tbody = table.querySelector('tbody');

function renderBooks() {
  tbody.innerHTML = ''; // Clear the table body first

  books.forEach((book, index) => {
    const row = document.createElement('tr');

    const statusCell = document.createElement('td');
    statusCell.textContent = book.read ? 'Read' : 'Not yet read';

    // Mark Button
    const markButton = document.createElement('button');
    markButton.textContent = book.read ? 'Mark as Unread' : 'Mark as Read';
    markButton.addEventListener('click', () => {
      book.read = !book.read;
      renderBooks(); // Re-render the table
    });

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '0.5em';
    deleteButton.style.color = 'red';
    deleteButton.addEventListener('click', () => {
      books.splice(index, 1);
      renderBooks(); // Re-render the table
    });

    const actionCell = document.createElement('td');
    actionCell.appendChild(markButton);
    actionCell.appendChild(deleteButton);

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
    `;
    row.appendChild(statusCell);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });
}

renderBooks();
div.appendChild(table);
