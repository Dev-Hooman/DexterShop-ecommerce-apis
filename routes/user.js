const router = require("express").Router()
const User = require('../models/User')
const CryptoJS = require('crypto-js')
const {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAdmin
} = require('../middleware/verifyToken')


router.put("/:id", verifyTokenAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString()
    }
    // console.log("Before Updating User....")
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        //The $set operator replaces the value of a field with the specified value.

        // console.log("After Updating User", updatedUser)
        res.status(200).json(updatedUser)
    } catch (err) {
        return res.status(500).json("Ooppsie")
    }
})

//Delete
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted...")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER
router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
    console.log(req.params.id)
    try {
        const user = await User.findById(req.params.id)
        console.log(user)
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others });

    } catch (err) {
        return res.status(500).json(err)
    }
})

//Get All Users
router.get("/", verifyTokenAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query
            ? await User.find().limit(5).sort({ _id: -1 })
            : await User.find()
        console.log(users)
        res.status(200).json(users);

    } catch (err) {
        return res.status(500).json(err)
    }
})

router.get("/stats", verifyTokenAdmin, async (req, res) => {

    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ])
        console.log("STATS DATA: ", data)
        res.status(200).json(data)
    } catch (err) {
        return res.status(500).json(err)

    }
})




module.exports = router