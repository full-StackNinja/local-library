const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const library_db = require("../library_db");
// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  await library_db.connect();
  const allGenres = await Genre.find({}).exec();

  res.render("genre_list", { title: "Genre List", genre_list: allGenres });
  await library_db.close();
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  await library_db.connect();

  const genreId = req.params.id;
  const genre = await Genre.findById({ _id: genreId });
  // console.log('genre name', genreName.name)
  const book_list = await Book.find({ genre: { $in: [genreId] } })
    .populate({
      path: "genre",
      match: { _id: genreId },
    })
    .exec();

  res.render("genre_detail", {
    title: `Genre: ${genre.name}`,
    book_list: book_list,
  });
  console.log(book_list);
  await library_db.close();
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
});

// Handle Genre create on POST.
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
});

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
});

// Handle Genre update on POST.
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
});
