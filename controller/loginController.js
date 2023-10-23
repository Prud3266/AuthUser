const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('../models/Users')

const loginUser = async(req, res)=>{
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
        //     { expiresIn: '1d'  }
        // );
        // const otherUsers = User.filter(user => user.email !== foundUser.email);
        // const currentUser = { ...foundUser, refreshToken}
        // Users.setUsers([...otherUsers, currentUser])
        // // await Users.insert()
        // res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24* 60 * 60 * 1000 })
        res.json({ "Success": `${foundUser.fullName} is logged in...`  })
    }else{
        res.sendStatus(401)
    }        
}

module.exports = { loginUser }