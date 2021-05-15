import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'


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
  name: {
    type: String,
    lowercase: true
  },
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

const Category = mongoose.model('Category', {
  category: String
})

const Movie = mongoose.model('Movie', {
  year_film: Number,
  year_award: Number,
  ceremony: Number,
  category: String,
  nominee: String,
  film: String,
  win: Boolean
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
    await Category.deleteMany()

    await goldenGlobesData.forEach((globesData) => {
      new Movie(globesData).save()
    })
    await goldenGlobesData.forEach((globesData) => {
      new Category(globesData).save()
    })
  }
  seedDataBase()
// }


// Routes
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
  // res.send('Hello hello hello world')
})

// app.get('/movies', (req, res) => {
//   // res.send('Hello hello world')
//   Movie.find().then(movie => {
//     res.json(movie)
//   })
// }) 

// Endpoint to get all movies
// app.get('/movies', async (req, res) => {
//   const movies = await Movie.find()
//   res.json(movies)
// })

app.get('/movies', async (req, res) => {
  // Queries to filter further
  const { year } = req.query
  const { win } = req.query
  
  if (year) {
    const movieByYear = await Movie.find({ year_film: year })
    res.json(movieByYear)
  } else if (win) {
    const movieByWin = await Movie.find({ win: win })
    res.json(movieByWin)
  } else {
    const movies = await Movie.find()
    res.json(movies)
  }
})

app.get('/movies/categories', async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})

// app.get('/movies/year/:year', async (req, res) => {
//   const { year } = req.params
//   const movieByYear = await Movie.find({ year_film: year })
//   res.json(movieByYear)
// }) 

// Endpoint param to get movie by id
app.get('/movies/id/:id', async (req, res) => {
  const { id } = req.params
  const movieByID = await Movie.findOne({ _id: id })
  res.json(movieByID)
})

//Endpoint to get movie by name
// app.get('/movies/name/:name', async (req, res) => {
//   const { nominee } = req.params
  // const { film } = req.params
  // const filmByName = await Movie.findOne({ film: film })
  // const movieByNominee = await Movie.findOne({ nominee: nominee })
  // if (film === filmByName) {
  //   res.json(filmByName)
  // } else if ()
// })

// Endpoint to get movies by name

app.get('/movies/name/:name', async (req, res) => {
  const { name } = req.params
  const movieByNominee = await Movie.find({ nominee: name })
  const movieByFilm = await Movie.find({ film: name })
  res.json({ movieByNominee, movieByFilm })
})

// Endpoint param to get nominees 
app.get('/movies/nominee/:nominee', async (req, res) => {
  const { nominee } = req.params
  const movieByNominee = await Movie.findOne({ nominee: nominee })
  res.json(movieByNominee)
})

// Endpoint query all movies from one year
// app.get('/movies/win/:win', async (req, res) => {
//   const { win } = req.params
//   const moviesThatWon = await Movie.find({ win: win })
//   res.json(moviesThatWon)
// }) 

app.get('/animals', (req, res) => {
  Animal.find().then(animals => {
    res.json(animals)
  })
})

app.get('/animals/name/:name', async (req, res) => {
  const { name } = req.params
  const singleAnimal = await Animal.findOne({ name: name })
  res.json(singleAnimal)
})

app.get('/animals/id/:id', async (req, res) => {
  const { animalId } = req.params
  const singleAnimalById = await Animal.findById({ animalId })
  res.json(singleAnimalById)
})


// app.get('/animals/:name', (req, res) => {
//   Animal.findOne({ name: req.params.name }).then(animal => {
//     if(animal) {
//       res.json(animal)
//     } else {
//       res.status(404).json({ error: 'not founfd'})
//     }
//   })
// })


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

