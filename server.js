const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('./models/Users')
const bodyParser = require('body-parser')
const verifyJWT = require('./middleware/verifyJWT')

app.use(express.urlencoded({ extended: true }));;

app.use(express.json())

app.use(cookieParser())
 
dotenv.config({path: './.env'})

// Routes
app.use('/signup', require('./routes/signup.js'))
app.use('/login', require('./routes/login.js'))
app.use('/refresh', require('./routes/refresh.js'))
app.use('/logout', require('./routes/logout.js'))

app.use(verifyJWT)
app.use('/users', require('./routes/users.js'))

const URL = process.env.URL
const PORT = process.env.PORT

mongoose.connect(URL).then(()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT,()=>{
        console.log(`Server Running on ${PORT}...`);
    })
}).catch((error)=>{
    console.log(error)
})