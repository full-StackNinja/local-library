const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all BookInstances.
exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate("book").exec();

  res.render("bookinstance_list", {
    title: "Book Instance List",
    bookinstance_list: allBookInstances,
  });
});

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();

  res.render("bookinstance_detail", { bookInstance });
});

// Display BookInstance create form on GET.
exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();
  res.render("bookinstance_form", {
    title: "Create Bookinstance",
    books: allBooks,
  });
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
  }),
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  // Get the requested copy
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec();
  res.render("bookinstance_delete", { bookInstance });
});

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  await BookInstance.findByIdAndDelete(req.params.id);
  res.redirect("/catalog/bookinstances");
});

// Display BookInstance update form on GET.
exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  const [allBooks, bookInstance] = await Promise.all([
    Book.find({}, "title").sort({ title: 1 }).exec(),
    BookInstance.findById(req.params.id).populate("book").exec(),
  ]);
  console.log("bookInstance", bookInstance.book._id.toString());
  res.render("bookinstance_form", {
    title: "Update Bookinstance",
    books: allBooks,
    bookInstance,
  });
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  body("book", "Book must be selected").trim().isLength({ min: 1 }).escape(),
  body("imprint", "Imprint is required").trim().isLength({ min: 1 }).escape(),
  body("status", "Status is required").escape(),
  body("due_back", "Invalid date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const books = await Book.find({}, "title").sort({ title: 1 }).exec();

    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id,
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
      const updatedBookInstance = await BookInstance.findByIdAndUpdate(
        req.params.id,
        bookInstance
      );
      res.redirect(updatedBookInstance.url);
    }
  }),
];
