const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('../models/Users')

const getAllUser = async(req, res)=>{
    res.json(await User.find())
}

const getUser = async(req, res)=>{
    // console.log(req.body.email);
    // res.json({ "email": req.body.email })
    // res.json(await User.findOne({ email:email }))
}
module.exports = { 
    getAllUser,
    getUser
 }