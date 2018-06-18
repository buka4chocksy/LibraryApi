var fs = require('fs');

function Library(name){
    this.name = name;
    this.books = [];
    this.borrowedBooks = [];
};
Library.prototype.getBorrowedLibrary = function(){
    return JSON.parse(fs.readFileSync('./borrowedDb.json', 'utf-8'));
};
Library.prototype.updateBorrowedLibrary = function(borrowedBooks){
    return fs.writeFileSync('./borrowedDb.json', JSON.stringify(borrowedBooks));
};
Library.prototype.getLibrary = function(){
    return JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
};
Library.prototype.updateLibrary = function(books){
    return fs.writeFileSync('./data.json', JSON.stringify(books));
};
Library.prototype.Book = function(lib, name, author, year){
    let books = lib.getLibrary();
    let borrowedBooks = lib.getBorrowedLibrary();
    let bks = books.concat(borrowedBooks);
    if (bks.length >= 1){
       let lastId = bks[bks.length-1].id;
            for (i=0; i<bks.length; i++){
                if (bks[i].id >= lastId){
                    lastId = bks[i].id+1;
                }
            }
        this.id = lastId;
   } else {
        this.id = 1;
   }
   this.name = name;
   this.author = author;
   this.year = year;
};
Library.prototype.addBook = function(book){
    this.books = this.getLibrary();
    this.books.push(book);
    this.updateLibrary(this.books);
    };
    
Library.prototype.getBooks = function(){
    this.books = this.getLibrary();
    return this.books;
};

Library.prototype.getBookById = function(id){
    this.books = this.getLibrary();
    for(let i = 0; i < this.books.length; i++){
        if(this.books[i].id == id){
            return this.books[i];
        }
    }
};
    
Library.prototype.getBookByIndex = function(id){
    this.books = this.getLibrary();
    for (let i = 0; i < this.books.length; i++){
        if(this.books[i].id == id){
            return i;
        }
    }
};
    
Library.prototype.deleteBook = function(id){
    let bookIndex = this.getBookByIndex(id);
    this.books.splice(bookIndex, 1);
    this.updateLibrary(this.books);
    };
    
Library.prototype.updateBook = function(id, param, value){
    let index = this.getBookByIndex(id);
    if (arguments.length !=3){
        return "Error - You must provide an ID, a parameter to edit and a value.";
    } else {
        if (param == "name"){
            this.books[index].name = value;
        } else if (param == "author"){
            this.books[index].author = value;
        } else if(param == "year"){
            this.books[index].year = value;
        } else if (param == "all"){
            this.books[index].name = value.name;
            this.books[index].author = value.author;
            this.books[index].year = value.year;
        } else {
            return "Error - You must specify what to update."
        }
        this.updateLibrary(this.books);
    }
    };
    
Library.prototype.getBooksByParam = function(param, value){
    this.books = this.getLibrary();
    let booksToReturn = [];
    for(let i = 0; i < this.books.length; i++){
        if (this.books[i][param] == value){
            booksToReturn.push(this.books[i]);
        }
    }
    return booksToReturn;
};

Library.prototype.getBorrowedBookById = function(id){
    this.borrowedBooks = this.getBorrowedLibrary();
    for(let i = 0; i < this.borrowedBooks.length; i++){
        if(this.borrowedBooks[i].id == id){
            return this.borrowedBooks[i];
        }
    }
};
    
Library.prototype.getBorrowedBookByIndex = function(id){
    this.borrowedBooks = this.getBorrowedLibrary();
    for (let i = 0; i < this.borrowedBooks.length; i++){
        if(this.borrowedBooks[i].id == id){
            return i;
        }
    }
};
    
Library.prototype.deleteBorrowedBook = function(id){
    let bookIndex = this.getBorrowedBookByIndex(id);
    this.borrowedBooks.splice(bookIndex, 1);
    this.updateBorrowedLibrary(this.borrowedBooks);
    };

Library.prototype.borrowBooks = function(id, student){
    this.books = this.getLibrary();
    this.borrowedBooks = this.getBorrowedLibrary();
    for (let i=0; i<id.length; i++){
        let details = this.getBookById(id[i]);
        details['Borrowed By'] = student;
        this.borrowedBooks.push(details);
        this.deleteBook(id[i]);
    }
    this.updateBorrowedLibrary(this.borrowedBooks);
};

Library.prototype.returnBorrowedBooks = function(student){
    this.books = this.getLibrary();
    this.borrowedBooks = this.getBorrowedLibrary();
    for (i=0; i<this.borrowedBooks.length; i++){
        if (this.borrowedBooks[i]['Borrowed By'] == student){
            let details = this.borrowedBooks[i];
            delete details['Borrowed By'];
            this.books.push(details);
            this.deleteBorrowedBook(this.borrowedBooks[i].id);
        }
    }
    this.updateLibrary(this.books)
};
Library.prototype.returnBorrowedBookById = function(id){
    this.books = this.getLibrary();
    this.borrowedBooks = this.getBorrowedLibrary();
    let details = this.getBorrowedBookById(id);
    if (details){
        delete details['Borrowed By'];
        this.books.push(details);
        this.deleteBorrowedBook(details.id);
        this.updateLibrary(this.books);
    }
}
module.exports = function(name){
    return new Library(name);
};