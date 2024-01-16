const Author = require("../models/author");
const asyncHandler = require("express-async-handler");

exports.author_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author List");
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  res.send(`Not IMplemented: author detail ${req.params.id}`);
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
