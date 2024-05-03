const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/.well-known/jwks.json'
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const jwtCheck = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, getKey, {
    audience: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/api/v2/',
    issuer: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/',
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { jwtCheck };
