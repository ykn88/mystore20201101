import jwt from 'jsonwebtoken'
import Cart from '../../models/Cart'
import Authenticated from '../../helpers/Authenticated'
import initDB from '../../helpers/initDB'

initDB()

export default async (req, res) => {
    switch(req.method) {
        
        case "GET":
            await fetchUserCart(req, res)
            break;
        case "PUT": 
            await addProduct(req, res)
            break;
        case "DELETE":
            await removeProduct(req, res)        
    }
}



const fetchUserCart =  Authenticated(async (req, res) => {
    const cart = await Cart.findOne({user: req.userId})
                        .populate('products.product')
    res.status(200).json(cart.products)
})

const addProduct = Authenticated(async (req, res) => {
    const {quantity, productId} = req.body
    const cart = await Cart.findOne({user: req.userId})
    const productExists = cart.products.some(pdoc => productId === pdoc.product.toString())
    if(productExists) {
        await Cart.findOneAndUpdate(
            {_id: cart._id, "products.product": productId},
            {$inc: {"products.$.quantity": quantity}}
        )
    } else {
        const newProduct = {
            quantity,
            product: productId
        }
        await Cart.findOneAndUpdate({_id: cart._id}, {$push: {products: newProduct}})
    }
    res.status(200).json({message: "added to cart"})
})

const removeProduct = Authenticated(async (req, res) => {
    const {productId} = req.body
    const cart = await Cart.findOneAndUpdate(
        {user: req.userId},
        {$pull: {products: {product: productId}}},
        {new: true}
    ).populate("products.product")
    res.status(200).json(cart.products)
})