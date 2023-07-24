const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

router.post("/register", async (req, res) => {
    console.log("Register Router Triggered")
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(402).json("please fill the form...")
        }

        const emailExist = await User.findOne({ email })

        if (emailExist) {
            return res.status(408).json("Email Already Taken...")
        } else {
            const newUser = new User({
                username: username,
                email: email,
                password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(),
            })
            const savedUser = await newUser.save();
            res.status(201).json(savedUser)
        }

    } catch (err) {
        res.status(500).json(err)

    }

})

router.post('/login', async (req, res) => {
    console.log("Login Route Triggered...")
    try {
        const user = await User.findOne({ email: req.body.email });
        // console.log(user)

        !user && res.status(401).json("Wrong User Name");

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        );
        // console.log("Hashed Password", hashedPassword)
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;

        originalPassword != inputPassword &&
            res.status(401).json("Wrong Password");

        const accessToken = jwt.sign(
        {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );

        const { password, ...others } = user._doc;  
        res.status(200).json({...others, accessToken} );

    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = router