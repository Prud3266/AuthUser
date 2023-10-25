const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('../models/Users')

const signupUser = async(req, res)=>{
    const { fullName, email, phoneNumber, password } = req.body
    console.log("Request Body String:",req.body);
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
        const newUser = await User.create({
            "fullName": fullName,
            "email": Email,
            "phoneNumber": phoneNumber,
            "password": hashedPassword,         
        }) 
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { signupUser }