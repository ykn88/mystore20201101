import React, {useState} from 'react'
import baseUrl from '../helpers/baseUrl'
import {parseCookies} from 'nookies'
import cookie from 'js-cookie'
import {useRouter} from 'next/router'
import Link from 'next/link'
import StripeCheckout from 'react-stripe-checkout'

const Cart = ({error, products}) => {

    const {token} = parseCookies()

    const router = useRouter()

    const [cProducts, setCProducts] = useState(products)
    let price = 0

    if(!token) {
        return (
            <div className="center-align">
                <h3>Please login to view your cart</h3>
                <Link href='/login'>
                  <a>
                      <button className='btn #1565c0 blue darken-3' >Login</button>
                  </a>
                </Link>
            </div>
        )
    }

    const handleRemove = async (pid) => {
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                productId: pid
            })
        })

        const data = await res.json()
        setCProducts(data)
    }

    const CartItems = () => {
        return (
            <>
               {cProducts.map(product => {
                   price += (product.quantity * product.product.price)
                   return (
                      <div key={product.product._id} style={{display: "flex", margin: "20px"}}>
                          <img src={product.product.mediaUrl} style={{width: '30%'}}/>
                          <div style={{marginLeft: "20px"}}>
                            <h6>{product.product.name}</h6>
                            <h6>{product.quantity} x {product.product.price}</h6>
                            <button className='btn red' onClick={() => handleRemove(product.product._id)}>Delete</button>
                          </div>
                      </div>
                   )
               })}
            </>
        )
    }

    if(error) {
        M.toast({html: error, classes: "red"})
        cookie.remove("user")
        cookie.remove("token")
        router.push('/login')
    }

    const handleCheckout = async (paymentInfo) => {
        const res = await fetch(`${baseUrl}/api/payment`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization":token,
            },
            body: JSON.stringify({
                paymentInfo
            })
        })
        const data = await res.json()
        M.toast({html: data.message, classes: "green"})
        router.push('/')
    }

    const TotalPrice = () => {
        return (
            <div className='container' style={{display: "flex", justifyContent: "space-between"}}>
                <h5>total: &#8377; {price}</h5>
                {products.length != 0 && (
                    <StripeCheckout
                    name="MyStore"
                    amount={price * 100}
                    image={products.length > 0 ? products[0].product.mediaUrl : ""}
                    currency="INR"
                    shippingAddress={true}
                    billingAddress={true}
                    zipCode={true}
                    stripeKey="pk_test_51HiO5bGz11wdUqiZCoFz4IamGIv6iqVmImD6Lshk5piKEYxTvnBm12YswZIqaVmiEPKGACIFButZRNReg8tmkuzB00jaiE4ReV"
                    token={(paymenInfo) => handleCheckout(paymenInfo)}
                    >
                    <button className='btn'>Checkout</button>
                    </StripeCheckout>
                )}
            </div>
        )
    }

    return (
        <div className='container'>
            <CartItems />
            <TotalPrice />
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx)

    if(!token) return {
        props: { products: [] }
    }

    const res = await fetch(`${baseUrl}/api/cart`, {
        headers: {
            "Authorization": token
        }
    })
    const products = await res.json()

    if(products.error) {
        return {
            props: {error: products.error}
        }
    }

    console.log("products: ", products)
    return {
        props: { products }
    }
}

export default Cart
