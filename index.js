const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const moviesRoutes = require('./routes/movies')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

//Mongoose connection to DB
const mongoose = require('mongoose')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myMovie');
}


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//Middleware
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: 'needasecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use('/', userRoutes)
app.use('/movies', moviesRoutes)
app.use('/movies/:id/reviews', reviewsRoutes)

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh, no something went wrong!'
  res.status(statusCode).render('error', { err });
})



app.listen(port, () => {
    console.log('CONNECTION ESTABLISHED ON PORT 3000')
})