const router = require("express").Router()
const Product = require('../models/Product')
const {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAdmin
} = require('../middleware/verifyToken')

//CREATE PRODUCT
router.post('/add', verifyTokenAdmin, async (req, res) => {
    console.log(req.body);
    const newProduct = new Product(req.body)

    try {

        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    } catch (err) {
        res.status(500).json(err)
    }
})

//update Products
router.put("/:id", verifyTokenAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedProduct)
    } catch (err) {
        return res.status(500).json("Ooppsie")
    }
})

// //Delete
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product deleted.")
    } catch (err) {
        return res.status(500).json(err)
    }
})

// //GET PRODUCT
router.get("/find/:id", async (req, res) => {

    try {
        const getProducts = await Product.findById(req.params.id)
        res.status(200).json(getProducts);

    } catch (err) {
        return res.status(500).json(err)
    }
})

// //Get All Products
router.get("/", async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category

    try {
        let products = []

        if (qNew) {

            products = await Product.find().sort({ createAt: -1 }).limit(5)

        } else if (qCategory) {
            //if specific params is in the array then return that obj
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = await Product.find();

        }
        console.log(products)

        res.status(200).json(products);

    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router