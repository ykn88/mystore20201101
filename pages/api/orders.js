import initDB from '../../helpers/initDB'
import Order from '../../models/Order'
import Authenticated from '../../helpers/Authenticated'

initDB()

export default Authenticated(async (req, res) => {
    try {
        const orders = await Order.find({user: req.userId}).populate("products.product")
                            
        res.status(200).json(orders)
        
    } catch (error) {
        console.log(error)
    }
})