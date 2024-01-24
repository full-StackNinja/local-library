const Genre = require("../models/genre");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
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
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Genre name must be at least 3 characters long")
    .escape(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract errors from req object
    const errors = validationResult(req);

    // Create genre object for the current request
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid.
      // First connect with database
      await library_db.connect();

      // Check whether genre with same name is already created
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({
          locale: "en",
          strength: 2,
        })
        .exec();
      // console.log('genre status', genreExists)
      if (genreExists) {
        // Then redirect to its detail page
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // and then redirect to its detail page
        res.redirect(genre.url);
      }
    }
    // At the end close the database connection
    await library_db.close();
  }),
];

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
