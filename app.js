// Book constructor
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;

  this.info = function() {
    let readStatus = this.read ? 'has been read' : 'not read yet';
    return `<span class="title">${this.title}</span> <span class="author">by ${this.author}</span> <span>${this.pages} pages, ${readStatus}</span>`;
  }
}

// add book to a myLibrary var
const myLibrary = [];
function addBookToLibrary(book) {
  if (book instanceof Book) {
    return myLibrary.push(book);
  }
  else {
    console.log("ERROR: Cannot add non-book to library");
  }
}

//Some test books
const books = [new Book('Lord of the Rings', 'JRR Tolkien', 500, true), 
              new Book('The Long Goodbye', 'Raymond Chandler', 300, true),
              new Book('I, Robot', 'Isaac Asimov', 200, false),
              new Book('Altered Carbon', 'Richard Morgan', 350, true),
              new Book('Macbeth', 'Shakespeare', 100, true)];

books.forEach((book) => {
  addBookToLibrary(book);
});

// Iterate through the library var and create a .book card for every book
const shelves = document.querySelector('#shelves');
function displayLibrary() {
  shelves.innerHTML = `<div class="book new"><div class="text"><button onclick="toggleHideShow('new-book')">NEW</button></div></div>`
  let index = 0;
  myLibrary.forEach((book) => {
    let readBtnTxt = 'Read';
    if (book.read) {
      readBtnTxt = 'Unread';
    }
    shelves.innerHTML += `<div class="book" data-index="${index}"><div class="text">${book.info()}
                          <div class="actions"><button class="toggleRead" onclick="toggleRead(${index})">${readBtnTxt}</button><button class="delete" onclick="deleteBook(${index})">Delete</button>
                          </div></div></div>`;
    index += 1;
  });
}

function addNewBook(event) {
  event.preventDefault();
  var formData = new FormData(event.target);
  const newBook = new Book(formData.get('btitle'), formData.get('bauthor'), formData.get('bpages'), formData.get('bread') == 'read');
  addBookToLibrary(newBook);
  displayLibrary(); //Eventually, for optimization purposes, may need to adjust this so it's not reloading whole list every time
  toggleHideShow('new-book');
  event.target.reset();
}

function deleteBook(index) {
  myLibrary.splice(index, 1);
  displayLibrary();
}

function toggleRead(index) {
  myLibrary[index].read = !myLibrary[index].read;
  displayLibrary();
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

function initialize(){
  // Load up the initial library
  displayLibrary();

  // Add the overlay closing function
  document.getElementById('new-book').addEventListener('click', function(event) {
    if (event.target === event.currentTarget) {
        this.classList.remove('flex');
        this.classList.add('hidden');
    }
  });

  document.getElementById("new-book-form").addEventListener("submit", (event) => { addNewBook(event);});
}

initialize();