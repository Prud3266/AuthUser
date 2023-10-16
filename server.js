const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('./models/Users')

app.use(express.json())
 
dotenv.config({path: './.env'})

// Routes
app.use('/signup', require('./routes/signup.js'))
app.use('/login', require('./routes/login.js'))

const URL = process.env.URL
const PORT = process.env.PORT

// app.listen(PORT,()=>{
//     console.log(`Server Running on ${PORT}...`);
// })

mongoose.connect(URL).then(()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT,()=>{
        console.log(`Server Running on ${PORT}...`);
    })
}).catch((error)=>{
    console.log(error)
})