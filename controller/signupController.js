const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const path = require('path')
const User = require('../models/Users')
const { phone } = require('phone')

const signupUser = async(req, res)=>{
    const { fullName, email, phoneNumber, password } = req.body
    if(!email || !password) return res.status(400).json({ 'message': 'Email and password are required'});
    // check if the email is valid
    const Email = email.toLowerCase()
    const phone_number = '+234'+phoneNumber.slice(1)
    if(!phone(phone_number).isValid) return res.status(400).json({ 'message': 'Phone number is wrong'});
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
            "phoneNumber": phone_number,
            "password": hashedPassword,         
        }) 
        const resp = {
            "Status": 'Account Successfully Created!',
            "fullName": fullName,
            "email": Email,
            "phoneNumber": phone_number,
        }
        // res.json(newUser)
        res.status(201).json(resp)
    } catch (error) {
        res.status(500).json({ 'message': error.message });
    }
}

module.exports = { signupUser }