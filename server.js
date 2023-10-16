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

//middlewares
// const verify = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) return res.sendStatus(401)
//     console.log(authHeader)
//     const token = authHeader.split(' ')[1]
//     jwt.verify(
//         token,
//         process.env.ACCESS_TOKEN_SECRET,
//         (err, decoded)=>{
//             if (err) return res.sendStatus(403)
//             req.user = decoded.username
//             next()
//         }
//     )
// }

// fetch user for logging in
// app.post('/login', async(req, res)=>{
//     console.log(req.body)
//     const { email, password } = req.body
//     console.log(email);
//     const Email = email.toLowerCase()
//     if(!Email || !password) return res.status(400).json({ 'message': 'Email and password are required'});
//     const foundUser = await User.findOne({ email : Email })
//     if(!foundUser) return res.sendStatus(401)
//     // Check password
//     const match = await bcrypt.compare(password, foundUser.password)
//     console.log(match)
//     if (match) { 
//         // const accessToken = jwt.sign(
//         //     { "email": foundUser.email },
//         //     process.env.ACCESS_TOKEN_SECRET,
//         //     { expiresIn: '30s' }
//         // );
//         // const refreshToken = jwt.sign(
//         //     { "email": foundUser.email },
//         //     process.env.REFRESH_TOKEN_SECRET,
//         //     { expiresIn: '1d'  }
//         // );
//         // const otherUsers = User.filter(user => user.email !== foundUser.email);
//         // const currentUser = { ...foundUser, refreshToken}
//         // Users.setUsers([...otherUsers, currentUser])
//         // // await Users.insert()
//         // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24* 60 * 60 * 1000 })
//         res.json({ "Success": `${foundUser.fullName} is logged in...`  })
//     }else{
//         res.sendStatus(401)
//     }        
// })
// verify()

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