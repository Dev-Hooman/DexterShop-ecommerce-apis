const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const paymentRoute = require('./routes/stripe')


const bp = require('body-parser')
const { application } = require("express")

dotenv.config()

const app = express();
app.use(bp.json())
app.use(cors())


mongoose.connect("mongodb://localhost:27017/another-one")
    .then(() => console.log("DB Connection Success..."))
    .catch((err) => { console.log(`No DB Connection ${err}`) })

app.use("/api/auth", authRoute)
app.use('/api/cart', cartRoute)
app.use("/api/user", userRoute)
app.use('/api/products', productRoute)
app.use('/api/order', orderRoute)
app.use('/api/checkout', paymentRoute)



app.listen(process.env.PORT || 8000, () => {
    console.log(`Listining on PORT ${process.env.PORT}`)
})