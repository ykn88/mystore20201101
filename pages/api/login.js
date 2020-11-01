import initDB from '../../helpers/initDB'
import User from '../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

initDB()

export default async (req, res) => {
    const {email, password} = req.body
    try {
        
        if(!email || !password) 
          return res.status(422).json({error: "Please add all fields"})
        
        const user = await User.findOne({email}) 
        
        if(!user) return res.status(404).json({error: "email doesn't exists"})

        const doMatch = await bcrypt.compare(password, user.password)
        
        if(doMatch) {
          const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d" 
          })
          const {name, email, role} = user
          res.status(201).json({token, user:{name, email, role}})
        } else {
          return res.status(401).json({error: "email or password doesn't match"})
        }

    } catch (error) {
        console.log(error)
    }
}  