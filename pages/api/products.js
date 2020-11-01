import initDB from '../../helpers/initDB'
import Product from '../../models/Product'

initDB()

export default async (req, res) => {
  switch(req.method) {
    case "GET": 
      await getAllProducts(req, res)
      break;
    case "POST": 
      await saveProduct(req, res)
      break  
  }
  
} 

const getAllProducts = async (req, res) => {
  const products = await Product.find()
  res.status(200).json(products)
}

const saveProduct = async(req, res) => {
  
  const {name, price, mediaUrl, description} = req.body
  try {
    if(!name || !price || !description || !mediaUrl) {
      return res.status(422).json({error: "Please add all data"})
    }
  
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl
    }).save()
  
    res.status(201).json(product)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "internal server error"})  
  }  
}