import React, {useState} from 'react'
import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const userLogin = async (e) => {
        e.preventDefault()
        const res = await fetch(`${baseUrl}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json" 
            },
            body:JSON.stringify({
                email,
                password
            })
        })

        const data = await res.json()

        if(data.error) {
            M.toast({html: data.error, classes: "red"})
        } else {
           console.log(data) 
           cookie.set('token', data.token)
           cookie.set('user', data.user)
           router.push('/account')
        }
    }

    return (
        <div className="container card authcard center-align">
            <h3>Login</h3>
            <form onSubmit={(e) => userLogin(e)}>
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
                <button className="btn waves-effect waves-light #1565c0 blue darken-3" type="submit">Login
                   <i className="material-icons right">forward</i>
                </button>
            </form>
            
            <Link href='/signup'>
              <a><h5>Don't have an account?</h5></a>
            </Link>
        </div>
    )
}

export default Login
