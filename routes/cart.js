const router = require("express").Router()
const Cart = require('../models/Cart')
const {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAdmin
} = require('../middleware/verifyToken')

//CREATE
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);

    } catch (err) {
        res.status(500).json(err)
    }
})

//update Products
router.put("/:id", verifyTokenAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedCart)
    } catch (err) {
        return res.status(500).json("Ooppsie")
    }
})

// //Delete
router.delete("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart deleted.")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER CART
router.get("/find/:userId", verifyTokenAuthorization, async (req, res) => {

    try {
        const cart = await Cart.find({ userId: req.params.userId })
        res.status(200).json(cart);

    } catch (err) {
        return res.status(500).json(err)
    }
})

//Get All Cart
router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts);
    } catch (err) {
        return res.status(500).json(err)
    }

})


module.exports = router