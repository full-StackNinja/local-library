const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const library_db = require("../library_db");
exports.author_list = asyncHandler(async (req, res, next) => {
  await library_db.connect();

  const allAuthors = await Author.find({}).exec();

  res.render("author_list", { title: "Author List", author_list: allAuthors });

  await library_db.close();
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  await library_db.connect();
  const [author, author_books] = await Promise.all([
    Author.findById(req.params.id),
    Book.find({ author: req.params.id }),
  ]);
  res.render('author_detail', {author, author_books})
  await library_db.close();
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOt Implemented: author create get ");
});

exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOt implemented: author create post");
});

exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOt implemented: author delete get");
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented: author delete post");
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented: author update get");
});

exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implemented: author update post");
});
