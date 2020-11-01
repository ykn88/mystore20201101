import Stripe from 'stripe'
import {v4 as uuidv4} from 'uuid'
import Cart from '../../models/Cart'
import Order from '../../models/Order'
import jwt from 'jsonwebtoken'
import initDB from '../../helpers/initDB'

initDB()

export default async (req, res) => {
   const stripe = Stripe(process.env.STRIPE_SECRET) 
   const {paymentInfo} =  req.body
   const {authorization} = req.headers
        if(!authorization) return res.status(401).json({error: "you must be logged in"})
        try {
              const { userId } = jwt.verify(authorization, process.env.JWT_SECRET)
              const cart = await Cart.findOne({user: userId}).populate("products.product")
              let price = 0
              cart.products.forEach(item => {
                price += (item.quantity * item.product.price) 
              })
              const prevCustomer = await stripe.customers.list({
                email: paymentInfo.email
              })
              const isExistingCustomer = prevCustomer.data.length > 0
              
              let newCustomer = {}

              if(!isExistingCustomer) {
                newCustomer = await stripe.customers.create({
                   email: paymentInfo.email,
                   source: paymentInfo.id
                })
               }
                const charge = await stripe.charges.create({
                   currency: "INR",
                   amount: price * 100,
                   receipt_email: paymentInfo.email,
                   customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
                   description: `You made a payment of INR ${price}`
                }, {
                    idempotencyKey: uuidv4()
                })

                const newOrder = await new Order({
                    user: userId,
                    email: paymentInfo.email,
                    total: price,
                    products: cart.products
                }).save()

                await Cart.findByIdAndUpdate(
                    {_id: cart._id},
                    {$set: {products: []}}
                )

                res.status(200).json({message: "Payment successful"})

            } catch (error) {
                return res.status(401).json({error: "error processing payment"})       
            }
}