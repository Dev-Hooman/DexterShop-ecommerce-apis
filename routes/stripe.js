const router = require('express').Router()

const stripe = require('stripe')('sk_test_51LmVQ4EtvWEzIuymCjxY7y8ahmW9TTwLTQHp0SQKoh6gvcKD0FNaeyhuCDzp1icWKu0oU2uOiVmhEN9ozjA8oh5D00zExl7kZK')

router.post("/payment", (req, res)=>{
    console.log("Stripe Route triggered...")
    stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency: "usd"
    }), (stripeErr, stripeRes) => {

        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes);
        }
    }
})

module.exports = router;