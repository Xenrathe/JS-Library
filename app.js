// Book class holds an instance of a single book
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  info() {
    let readStatus = this.read ? 'has been read' : 'not read yet';
    return `<span class="title">${this.title}</span> <span class="author">by ${this.author}</span> <span>${this.pages} pages, ${readStatus}</span>`;
  }
}

//Library class holds an instance of a single Library
//Really, I would be doing some sort of closure / Module pattern - but the assignment is to use classes
class Library {
  constructor(books, shelves, name) {
    this.globalName = name;
    this.books = books;
    this.shelves = shelves;
  }

  // Internal / private book addition to the books array
  #addBook(book) {
    if (book instanceof Book) {
      this.books.push(book);
    }
    else {
      console.log("ERROR: Cannot add non-book to library");
    }
  }

  // User will utilize this function via form
  addBookFromForm(event) {
    event.preventDefault();
    var formData = new FormData(event.target);
    const newBook = new Book(formData.get('btitle'), formData.get('bauthor'), formData.get('bpages'), formData.get('bread') == 'read');
    this.#addBook(newBook);
    this.displayLibrary(); //Eventually, for optimization purposes, may need to adjust this so it's not reloading whole list every time
    toggleHideShow('new-book');
    event.target.reset();
  }

  // Remove book from internal books
  deleteBook(index) {
    this.books.splice(index, 1);
    this.displayLibrary();
  }

  // Toggles the book's read value between true and false
  toggleRead(index) {
    this.books[index].read = !this.books[index].read;
    this.displayLibrary();
  }

  // Displays whole library from scratch, including the new book div.
  // Could be optimized on add/delete/alter on a book-by-book basis
  displayLibrary() {
    this.shelves.innerHTML = `<div class="book new"><div class="text"><button onclick="toggleHideShow('new-book')">NEW</button></div></div>`
    let index = 0;
    this.books.forEach((book) => {
      let readBtnTxt = 'Read';
      if (book.read) {
        readBtnTxt = 'Unread';
      }
      shelves.innerHTML += `<div class="book" data-index="${index}"><div class="text">${book.info()}
                            <div class="actions"><button class="toggleRead" onclick="${this.globalName}.toggleRead(${index})">${readBtnTxt}</button><button class="delete" onclick="${this.globalName}.deleteBook(${index})">Delete</button>
                            </div></div></div>`;
      index += 1;
    });
  }
}

//Add/remove the 'hidden' and 'flex' classes to hide/show
function toggleHideShow(idName) {
  const object = document.querySelector(`#${idName}`);

  if (object == null){
    console.log(`toggleHideShow failed to find ${idName}`);
    return;
  }

  if (object.classList.contains('hidden')){
    object.classList.remove('hidden');
    object.classList.add('flex');
  }
  else {
    object.classList.remove('flex');
    object.classList.add('hidden');
  }
}

//Called exactly once upon page load
function initialize(library){
  // Load up the initial library
  library.displayLibrary();

  // Add the overlay closing function
  document.getElementById('new-book').addEventListener('click', function(event) {
    if (event.target === event.currentTarget) {
        this.classList.remove('flex');
        this.classList.add('hidden');
    }
  });

  document.getElementById("new-book-form").addEventListener("submit", (event) => { library.addBookFromForm(event);});
}

//Some test books
const books = [new Book('Lord of the Rings', 'JRR Tolkien', 500, true), 
  new Book('The Long Goodbye', 'Raymond Chandler', 300, true),
  new Book('I, Robot', 'Isaac Asimov', 200, false),
  new Book('Altered Carbon', 'Richard Morgan', 350, true),
  new Book('Macbeth', 'Shakespeare', 100, true)];

const shelves = document.querySelector('#shelves');
const myLibrary = new Library(books, shelves, 'myLibrary');
initialize(myLibrary);