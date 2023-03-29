const jwt = require('jsonwebtoken')

function generateAccessToken (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

function verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
}

module.exports = { generateAccessToken, verifyAccessToken }
