var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Library = require('./bookLibrary.js');

var library = Library("tenece");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000);
console.log("Server started successfully...");

app.get('/', function(req, res){
    res.send(library.getBooks());
});
app.post('/api/addBook', function(req, res){
    let book = new library.Book(library,req.body.name, req.body.author, req.body.year);
    library.addBook(book);
    res.send(library.getBooks());
});
app.delete('/api/deleteBook', function(req, res){
    let bookId = req.body.id;
    library.deleteBook(bookId);
    res.send(library.getBooks());
});
app.put('/api/updateBook', function(req, res){
    let id = req.body.id;
    let newBook = new library.Book(req.body.name, req.body.author, req.body.year, id);
    library.updateBook(id, newBook);
    console.log(`Book with ID:${id} has been updated.`);
    res.send(library.getBooks());
});
app.get('/api/getBookById', function(req, res){
    let id = req.query.id;
    res.send(library.getBookById(id));
});
app.get('/api/getBookByParam', function(req, res){
    let param = req.query.param;
    let value = req.query.value;
    res.send(library.getBooksByParam(param, value));
});
app.get('/api/getBorrowedBooks', function(req, res){
    res.send(library.getBorrowedLibrary());
});
app.put('/api/borrowBook', function(req, res){
    let id = req.body.id.split(',');
    let student = req.body.student;
    library.borrowBooks(id, student);
    res.send(library.getBorrowedLibrary());
});
app.put('/api/returnBook', function(req, res){
    if (req.body.id){
        library.returnBorrowedBookById(req.body.id);
        res.send(library.getBooks());
    } else if (req.body.student){
        library.returnBorrowedBooks(req.body.student);
        res.send(library.getBooks());
    } else {
        res.send("Please specify book(s) to return, either by ID or student");
    }
});