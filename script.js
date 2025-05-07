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

// Create the table and header
const table = document.createElement('table');
table.innerHTML = `
    <thead>
        <tr>
            <th> ID </th>
            <th>Title</th>
            <th>Author</th>
            <th># of Pages</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody></tbody>
`;

const tbody = table.querySelector('tbody');

// Populate table rows
for (const book of books) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.ID}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.pages}</td>
        <td>${book.read ? "Read" : "Not yet read"}</td>
    `;
    tbody.appendChild(row);
}

// Add the table to the container
div.appendChild(table);

