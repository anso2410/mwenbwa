const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token'); // or req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json({errors: [{msg: 'No token, authorization denied'}]});
    }

    // Verify token
    try {
        jwt.verify(token,
            config.get('jwtSecret'),
            (error, decodedToken) => {
            if (error) {
                return res.status(401).json({errors: [{msg: "Token is not valid."}]});
            }
            else {
                //if (req.body.user.id && req.body.user.id !== decodedToken.user.id) {
                  //  throw "Invalid user ID";
                //} else {
                    req.user = decodedToken.user; // On ne teste pas si les users correspondent ici...
                    next();
                //}
            }
        });
    } catch {
        console.error('Something wrong with auth middleware.');
        res.status(500).json({ msg: 'Server Error' });
    }
};
