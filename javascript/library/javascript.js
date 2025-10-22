const myLibrary = [];

function Book(author, title, numOfPage, read) {
    if (!new.target) { throw new Error("not Constructor call"); }
    this.id = crypto.randomUUID();
    this.author = author;
    this.title = title;
    this.numOfPage = numOfPage;
    this.read = read;

    this.info = () => `${this.title} by ${this.author}, 
                       ${this.numOfPage} pages, 
                       with ID ${this.id},
                       ${this.read ? 'was read' : 'is not read yet'}`;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('book-form');
  form.addEventListener('submit', createNewBook);
});

function createNewBook(event) {
    event.preventDefault(); // Prevents the default form submission (page reload)

    // Get form values
    const author = document.getElementById('author').value.trim();
    const title = document.getElementById('title').value.trim();
    const pages = parseInt(document.getElementById('pages').value);
    const read = document.getElementById('read').checked;
    
    if (!author || !title || isNaN(pages)) {
      alert('Please fill in all fields correctly.');
      return;
    }

    addBookToLibrary(author, title, pages, read);
    document.getElementById('book-form').reset();
}

function addBookToLibrary(author, title, pages, read) {
  // take params, create a book then store it in the array
    const book = new Book(author, title, pages, read);
    myLibrary.push(book);
    displayBook(book);
}

function displayBook(book) {
    let booksContainer = document.getElementById('books-container');
    if(booksContainer) {
        addBookRow(booksContainer, book);
        return;
    }

    document.getElementById("output").innerHTML = `
    <table>
        <thead>
        <tr>
            <th>Author</th>
            <th>Title</th>
            <th>Pages</th>
            <th>Read</th>
        </tr>
        </thead>
        <tbody id="books-container">
            <!-- Rows will be added here -->
        </tbody>
    </table>
    `;        
    booksContainer = document.getElementById('books-container');
    myLibrary.forEach(b => addBookRow(booksContainer, b));

    booksContainer.addEventListener('click', removeBookEventListener);
}

function addBookRow(booksContainer, book) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${book.author}</td>
    <td>${book.title}</td>
    <td>${book.numOfPage}</td>
    <td class="read-status">${book.read ? "Yes" : "No"}</td>    
    <td>
      <button class="toggle-read-btn">Toggle Read</button>
      <button class="remove-btn">Remove</button>
    </td>
  `;
  row.setAttribute('data-id', book.id);
  booksContainer.appendChild(row);
}

function removeBookEventListener(e) {
  if (!e.target) {
    return;
  }

  const target = e.target;
  const row = target.closest('tr');

  if (!row) return;

  const bookId = row.getAttribute('data-id');

  if (target.classList.contains('remove-btn')) {
    removeBook(bookId);
  }

  if (target.classList.contains('toggle-read-btn')) {
    const book = myLibrary.find(b => b.id === bookId);
    if (book) {
      book.toggleRead();
      const statusCell = row.querySelector('.read-status');
      statusCell.innerHTML = book.read ? "Yes" : "No";
      console.log(`Book ${book.title} read status is now: ${book.read}`);
    }
  }
}

function removeBook(bookId) {
  // Remove from list
  const index = myLibrary.findIndex(book => book.id === bookId);
  if (index !== -1) {
    myLibrary.splice(index, 1);
  }

  // Remove from table
  const booksContainer = document.getElementById('books-container');
  if (booksContainer) {
    const row = booksContainer.querySelector(`tr[data-id="${bookId}"]`);
    if (row) {
      row.remove();
    }
  }
}