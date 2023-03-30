const jwt = require('jsonwebtoken')

function generateAccessToken (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

function verifyAccessToken(accessToken) {
    var result = true;
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err){
        result = false;
      }
    });
    return result;
}

module.exports = { generateAccessToken, verifyAccessToken }
