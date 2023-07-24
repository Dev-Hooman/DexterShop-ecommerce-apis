const router = require("express").Router()
const Order = require('../models/Order')
const {
    verifyToken,
    verifyTokenAuthorization,
    verifyTokenAdmin
} = require('../middleware/verifyToken')

//CREATE
router.post('/add', verifyToken, async (req, res) => {
    console.log("ORDER ROUTE TRIGGERED ?")
    console.log(req.body)
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);

    } catch (err) {
        res.status(500).json(err)
    }
})

//update Products
router.put("/:id", verifyTokenAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedOrder)
    } catch (err) {
        return res.status(500).json("Ooppsie")
    }
})

// //Delete
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deleted.")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAuthorization, async (req, res) => {

    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders);

    } catch (err) {
        return res.status(500).json(err)
    }
})

//Get All Cart
router.get("/", verifyTokenAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json(err)
    }

})

//Monthly Income 
router.get("/income", verifyTokenAdmin, async (req, res) => {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1))

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount" ,
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        console.log("STATS DATA: ", income)
        res.status(200).json(income)
    } catch (err) {
        return res.status(500).json(err)
    }
})


module.exports = router