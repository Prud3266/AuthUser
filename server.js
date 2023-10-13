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

// create user in mongodb
app.post('/signup', async(req, res)=>{
    const { fullName, email, phoneNumber, password } = req.body
    console.log(req.body);
    if(!email || !password) return res.status(400).json({ 'message': 'Email and password are required'});

    // check if the email is valid
    const Email = email.toLowerCase()
    let Valid = false
    let characters = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    let testEmails = [Email];
    testEmails.forEach((address) => {
    Valid = characters.test(address)
    });
    if(!Valid) return res.status(400).json({ 'message': 'Email is not Valid'});
    //check if the email already exist
    const duplicate = await User.findOne({ email: Email }).exec();
    // if there is a duplicate email return a conflict message (409)
    if (duplicate) return res.status(409).json({ message: `${Email} already exist...` }); 
    try {
        const hashedPassword = await bcrypt.hash(password, 10)  
        console.log(email, " and ", password)           
        const newUser = await User.create({
            "fullName": fullName,
            "email": Email,
            "phoneNumber": phoneNumber,
            "password": hashedPassword,         
        }) 
        console.log(newUser);
        res.status(201)
        .json({ "message": `User ${fullName} created!`})
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
})

// fetch user for logging in
app.post('/login', async(req, res)=>{
    console.log(req.body)
    const { email, password } = req.body
    console.log(email);
    const Email = email.toLowerCase()
    if(!Email || !password) return res.status(400).json({ 'message': 'Email and password are required'});
    const foundUser = await User.findOne({ email : Email })
    if(!foundUser) return res.sendStatus(401)
    // Check password
    const match = await bcrypt.compare(password, foundUser.password)
    console.log(match)
    if (match) {
        // const accessToken = jwt.sign(
        //     { "email": foundUser.email },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: '30s' }
        // );
        // const refreshToken = jwt.sign(
        //     { "email": foundUser.email },
        //     process.env.REFRESH_TOKEN_SECRET,
        //     { expiresIn: '1d' }
        // );
        // const otherUsers = ...
        // const currentUser = ...
        // usersDb...PORT
        // await... 
        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24* 60 * 60 * 1000 })
        res.json({ "Success": `${foundUser.fullName} is logged in...`  })
    }else{
        res.sendStatus(401)
    }        
})

dotenv.config({path: './.env'})

const URL = process.env.URL
const PORT = process.env.PORT

mongoose.connect(URL).then(()=>{
    console.log("Connected to MongoDB")
    app.listen(PORT,()=>{
        console.log(`Server Running on ${PORT}...`);
    })
}).catch((error)=>{
    console.log(error);
})

