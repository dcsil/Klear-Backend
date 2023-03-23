const jwt = require("jsonwebtoken")

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}) // ask julian about refresh tokens
}

module.exports=generateAccessToken
