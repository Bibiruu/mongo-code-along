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
    type: mongoose.Schema.Types.ObjectId, // relating the object id to author
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

app.get("/authors/:id", async (req, res) => {
  const author = await Author.findById(req.params.id)

  if(!author){
    res.status(404).json({ error: "Error in author name."})
  } else {
    res.status(200).json(author)
  }
})

app.get("/books", async (req, res) => { // used the rresetdata when this.
  const books = await Book.find().populate('author') // populate with the author and pull it out
  res.json(books)
})

app.get("/authors/:id/books", async (req, res) => { // authors on  :id
  const author = await Author.findById(req.params.id)

  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) }) //find the books of this author
    res.status(200).json(books)
  } else {
    res.status(404).json({ error: "Error in author name."})
  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
