import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Animal model
const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})

// Instances of animal models
Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', age: 2, isFurry: true }).save()
  new Animal({ name: 'Olga', age: 3, isFurry: true }).save()
  new Animal({ name: 'Rick', age: 4, isFurry: false }).save()
  new Animal({ name: 'Lucas', age: 4, isFurry: false }).save()
})

// Movie model
const Movie = mongoose.model('Movie', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
})

// Nominee model
const Nominee = mongoose.model('Nominee', {
  nominee: String
})

// Instance of movie model

// Movie.deleteMany().then(() => {
//   new Movie({ year_film: 2010, nominee: 'Avataruds' }).save()
// })

// if (process.env.RESET_DB) {
  // console.log('resetting database')
  // const seedDataBase = async () => {
  //   await Movie.deleteMany({})
  //   // await Nominee.deleteMany()

  //   goldenGlobesData.forEach((globesData) => {
  //     new Movie(globesData).save()
  //     // new Nominee(globesdata.nominee).save()
  //   })
  // }
  // seedDataBase()
// }

// if (process.env.RESET_DB) {
  // console.log('resetting')
  const seedDataBase = async () => {
    await Movie.deleteMany({})
    await goldenGlobesData.forEach((globesData) => {
      new Movie(globesData).save()
    })
  }
  seedDataBase()
// }


// Routes
app.get('/', (req, res) => {
  res.send('Hello hello hello world')
})

// app.get('/movies', (req, res) => {
//   // res.send('Hello hello world')
//   Movie.find().then(movie => {
//     res.json(movie)
//   })
// }) 

app.get('/movies', async (req, res) => {
  const movies = await Movie.find()
  res.json(movies)
})

app.get('/movies/:id', async (req, res) => {
  const { id } = req.params
  const singleMovie = await Movie.findOne({ _id: id })
  res.json(singleMovie)
})


app.get('nominees', async (req, res) => {
  const nominees = await Nominee.find()
  res.json(nominees)
})

app.get('/moviejson', (req, res) => {
  //query to get nominee by name, eg. '?nominee=Avatar'
  const nominee = req.query.nominee
  if (nominee) {
    const moviesByNominee = goldenGlobesData.filter((movie) => movie.nominee === nominee)
    res.json(moviesByNominee)
  } else {
    res.json(goldenGlobesData)
  } 
})

app.get('/animals', (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
})

app.get('/animals/:name', (req, res) => {
  Animal.findOne({ name: req.params.name }).then(animal => {
    if(animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: 'not founfd'})
    }
  })
})




// app.get('/:name', async (req, res) => {
//   try {
//   Animal.findOne({ name: req.params.name }).then(animal => {
//     if(animal) {
//       res.json(animal)
//     } else {
//       res.status(404).json({ error: 'not found' })
//   } catch (err) {
//       res.status(400).json({ error: 'invalid animal name' })
//   }
// })

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

