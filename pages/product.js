import React from 'react'
import Link from 'next/link'

const product = () => {
    return (
        <div>
            <h1>Product Page here</h1> 
            <Link href='/'>
              <a>Go to Home Page</a>
            </Link>
        </div>
    )
}

export default product
