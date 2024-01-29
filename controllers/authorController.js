const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");
const author = require("../models/author");

exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find({}).exec();

  res.render("author_list", { title: "Author List", author_list: allAuthors });
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, author_books] = await Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }),
  ]);
  res.render("author_detail", { author, author_books });
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
  // Display author create form
  // console.log("author.date_of_birth.get", author.date_of_birth.get);
  res.render("author_form", { title: "Create Author" });
});

exports.author_create_post = [
  body("first_name", "First Name must be specified")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("First name cannot contain  non-alpha characters"),
  body("family_name", "Family name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("Family name cannot contain  non-alpha characters"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);
    // Create Author model with data received
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        author,
        errors: errors.array(),
      });
      return;
    } else {
      await author.save();
      res.redirect(author.url);
    }
  }),
];

exports.author_delete_get = asyncHandler(async (req, res, next) => {
  // Find details of author being deleted and his associated books
  const [author, authorBooks] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary")
      .sort({ title: 1 })
      .exec(),
  ]);
  res.render("author_delete", { author, authorBooks });
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
  await Author.findOneAndDelete({ _id: req.params.id }).exec();
  res.redirect("/catalog/authors");
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);
  res.render("author_form", { title: "Update author", author });
});

exports.author_update_post = [
  body("first_name", "First Name must be specified")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .isAlpha()
    .withMessage("First name cannot contain  non-alpha characters"),
  body("family_name", "Family name must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("Family name cannot contain  non-alpha characters"),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);
    // Create Author model with data received
    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        author,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedAuthor = await Author.findByIdAndUpdate(
        req.params.id,
        author,
      );
      res.redirect(updatedAuthor.url);
    }
  }),
];
