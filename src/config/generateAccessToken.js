const jwt = require("jsonwebtoken")

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) // ask julian about refresh tokens
}

module.exports=generateAccessToken
