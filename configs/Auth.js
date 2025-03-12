const jwt = require('jsonwebtoken');
const User = require('../models/user');

function genToken(user){
    const token = jwt.sign(
        {id: user.id},
        process.env.SECRET_KEY
    )

    return token;
}

async function verifyToken(req,res,next){
    const authHeader  = req.headers.authorization;
    // console.log(authHeader);
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error("Malformed Authorization Header");
        return res.status(400).send("Malformed Authorization Header");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log("Decoded Token:", decoded);

        // Fetch the user from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            console.error("User Not Found");
            return res.status(404).send("User Not Found");
        }

        // console.log("Authenticated User:", user);
        req.user = user; // Attach user to the request object
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error("Authorization Error:", error);
        res.status(401).send("Authorization Failed");
    }
}

module.exports = {
    genToken,
    verifyToken
}