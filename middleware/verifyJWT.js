const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const path = require('path')
dotenv.config({path: './.env'})

const verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401)
    console.log(authHeader)
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if (err) return res.sendStatus(403)
            req.user = decoded.username
            next()
        }
    )
}

module.exports = verify 