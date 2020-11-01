import React, {useState} from 'react'
import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import {useRouter} from 'next/router'

const Signup = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const userSignup = async(e) => {
       e.preventDefault()

       const res = await fetch(`${baseUrl}/api/signup`, {
           method: "POST",
           headers: {
               "Content-Type": "application/json"
           },
           body: JSON.stringify({
               name,
               email,
               password
           })
       })

       const data = await res.json()
       
       if(data.error) {
           M.toast({html: data.error, classes: "red"})
       } else {
           M.toast({html: data.message, classes: "green"})
           router.push('/login')
       }
    }

    return (
        <div className="container card authcard center-align">
            <h3>Signup</h3>
            <form onSubmit = {(e) => userSignup(e)}>
                <input 
                 type='text' 
                 placeholder='name' 
                 value={name}
                 onChange={(e) => setName(e.target.value)} 
                />
                <input 
                 type='email' 
                 placeholder='email' 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                 type='password' 
                 placeholder='password' 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)} 
                />
                <button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">Signup
                   <i className="material-icons right">forward</i>
                </button>
            </form>
            
            <Link href='/login'>
              <a><h5>Already have an account?</h5></a>
            </Link>
        </div>
    )
}

export default Signup
