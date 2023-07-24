const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    //Alternate way is to firstly store the token in Cookie
    //Parse the cookie to get a token and then verify.
    //In This one we get from headers when we Ignite our API
    const authHeader = req.headers.token
    // console.log("Auth Headers : ", authHeader)
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                res.status(403).json("Token is not Valid...")
            } else {
                req.user = user
                next();
            }
        })
    } else {
        return res.status(401).json("You are not Authenticatied")
    }
}

const verifyTokenAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        //here req.user is get from token req
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to do That...")
        }
    })
}

const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        //here req.user is get from token req
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not Admin")
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAdmin

}