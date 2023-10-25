const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/Users')

const loginUser = async(req, res)=>{
    const { email, password } = req.body
    const Email = email.toLowerCase()
    if(!Email || !password) return res.status(400).json({ 'message': 'Email and password are required'});
    const foundUser = await User.findOne({ email : Email }).exec();
    if(!foundUser) return res.sendStatus(401)
    // Check password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) { 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'  }
        );
        
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24* 60 * 60 * 1000 })
        res.json({ accessToken })
    }else{
        res.sendStatus(401)
    }        
}

module.exports = { loginUser }