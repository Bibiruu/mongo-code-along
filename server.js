import express from "express";
import cors from "cors";
import mongoose from 'mongoose' // connecting to the mongo database

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books" // the setup, the books will create a collection we want to make
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Author = mongoose.model('Author' , {
  name: String
})

const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId, // relating to a object id from another model
    ref: 'Author' 
  }
})

if (process.env.RESET_DATABASE) { // RESET_DATABASE can name this any for reset tho!
  console.log('Resetting database!')

  const seedDataBase = async () => {
  await Author.deleteMany() // no duplication

  const tolkien = new Author({ name: 'J.R.R Tolkien' })
  await tolkien.save()

  const rowling = new Author({ name: 'J.K Rowling'})
  await rowling.save()     //saving to the database =)

  await new Book ({ title: "Harry Potter and the Philosophers stone", author: rowling }).save()
  await new Book ({ title: "Harry Potter and the chamber of Secrets", author: rowling }).save()
  await new Book ({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
  await new Book ({ title: "Harry Potter and the Goblet of Fire" , author: rowling }).save()
  await new Book ({ title: "Harry Potter and the the Order of the Phoenix", author: rowling }).save()
  await new Book ({ title: "Harry Potter and the Half Blood Prince", author: rowling }).save()
  await new Book ({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
  await new Book ({ title: "The Lord of the Rings", author: tolkien }).save()
  await new Book ({ title: "The Hobbit", author: tolkien }).save()
}
  seedDataBase()            // invoke for display
}
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/authors", async (req, res) => {
  const authors = await Author.find() // will find all in your database
  res.json(authors)
})

app.get("/books", async (req, res) => {
  const books = await Book.find().populate('author') // populate with the author and pull it out
  res.json(books)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
