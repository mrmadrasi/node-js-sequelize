const jwt = require('jsonwebtoken');
// Define the middleware function
const middleWare = (req, res, next) => {
    let tokenHeaderKey = 'Authorization';
    let jwtSecretKey = process.env.JWT_SECRET;

    try {
        const token = req.header(tokenHeaderKey);
        const bearerToken = token.split(' ')[1];// Remove "Bearer " prefix
        const verified = jwt.verify(bearerToken, jwtSecretKey);
        console.log("verified",verified);
        if(verified){
            next();
        }else{
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send({ message: 'Unauthorized' });
    }
};

module.exports = { middleWare };