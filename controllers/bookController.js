const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [
    numBooks,
    numAuthors,
    numBookInstances,
    numAvailableBookInstances,
    numGenres,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    Author.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: "Available" }).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  const props = {
    title: "Local Library Home",
    book_count: numBooks,
    author_count: numAuthors,
    book_instance_count: numBookInstances,
    book_instance_available_count: numAvailableBookInstances,
    genre_count: numGenres,
  };

  // Render index page with above dynamic information
  res.render("index", props);
});

// Display list of all books.
exports.book_list = asyncHandler(async (req, res, next) => {
  // Connect with mongodb database

  const allBooks = await Book.find({}, "title author")
    .sort({ title: 1 })
    .populate("author")
    .exec();
  res.render("book_list", { title: "Book List", book_list: allBooks });
});

// Display detail page for a specific book.
exports.book_detail = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate([
      { path: "author" },
      { path: "genre" },
    ]),
    BookInstance.find({ book: req.params.id }),
  ]);

  res.render("book_detail", { book, bookInstances });
});

// Display book create form on GET.
exports.book_create_get = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find({}).sort({ family_name: 1 }).exec();
  const allGenres = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("book_form", {
    title: "Create Book",
    authors: allAuthors,
    genres: allGenres,
  });
});

// Handle book create on POST.
exports.book_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Book title is required").trim().isLength({ min: 3 }).escape(),
  body("summary", "Summary is required").trim().isLength({ min: 3 }).escape(),
  body("isbn", "ISBN is required").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const [allGenres, allAuthors] = await Promise.all([
      Genre.find({}).sort({ name: 1 }).exec(),
      Author.find({}).sort({ family_name: 1 }).exec(),
    ]);

    const book = new Book({
      title: req.body.title,
      summary: req.body.summary,
      isbn: req.body.isbn,
      author: req.body.author,
      genre: req.body.genre,
    });

    for (const genre in allGenres) {
      if (book.genre.includes(genre._id)) {
        genre.checked = true;
      }
    }

    if (!errors.isEmpty()) {
      res.render("book_create", {
        title: "Create Book",
        book,
        genres: allGenres,
        authors: allAuthors,
        errors: errors.array(),
      });
      return;
    } else {
      await book.save();
      res.redirect(book.url);
    }
  }),
];

// Display book delete form on GET.
exports.book_delete_get = asyncHandler(async (req, res, next) => {
  //Fist get the requested book and it's all the instances
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate("author").exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);
  res.render("book_delete", { book, bookInstances });
});

// Handle book delete on POST.
exports.book_delete_post = asyncHandler(async (req, res, next) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/catalog/books");
});

// Display book update form on GET.
exports.book_update_get = asyncHandler(async (req, res, next) => {
  const [book, authorList, genreList] = await Promise.all([
    Book.findById(req.params.id).populate("author").exec(),
    Author.find({}).sort({ name: 1 }).exec(),
    Genre.find({}).sort({ name: 1 }).exec(),
  ]);
  res.render("book-update", { book, authorList, genreList });
});

// Handle book update on POST.
exports.book_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },
  body("title", "Book title is required").trim().isLength({ min: 3 }).escape(),
  body("summary", "Summary is required").trim().isLength({ min: 3 }).escape(),
  body("isbn", "ISBN is required").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const [allGenres, allAuthors] = await Promise.all([
      Genre.find({}).sort({ name: 1 }).exec(),
      Author.find({}).sort({ family_name: 1 }).exec(),
    ]);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
      _id: req.params.id,
    });
    for (const genre in allGenres) {
      if (book.genre.includes(genre._id)) {
        genre.checked = true;
      }
    }

    if (!errors.isEmpty()) {
      res.render("book_update", {
        title: "Update Book",
        book,
        genres: allGenres,
        authors: allAuthors,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, book);
      res.redirect(updatedBook.url);
    }
  }),
];
