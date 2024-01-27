const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const library_db = require("../library_db");

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  await library_db.connect();
  const allBookInstances = await BookInstance.find().populate("book").exec();

  await library_db.close();

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  await library_db.connect();
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  res.render("bookinstance_detail", { bookInstance });
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  await library_db.connect();
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  res.render("bookinstance_form", {
    title: "Create Bookinstance",
    books: allBooks,
  });
  await library_db.close();
});

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body("book", "Book must be selected").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint is required").trim().isLength({ min: 1 }).escape(),
  body("status", "Status is required").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    await library_db.connect();

    const books = await Book.find({}, "title").sort({ title: 1 }).exec();

    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });
    if (!errors.isEmpty()) {
      res.render("bookinstance_form", {
        title: "Create Bookinstance",
        books: allBooks,
        bookinstance: bookInstance,
        errors: errors.array(),
      });
      return;
    } else {
      await bookInstance.save();
      res.redirect(bookInstance.url);
    }

    await library_db.close();
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});
