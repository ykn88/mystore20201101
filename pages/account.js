import React, {useEffect, useRef} from 'react'
import {parseCookies} from 'nookies'
import baseUrl from '../helpers/baseUrl'
import UserRoles from '../components/UserRoles'

const Account = ({orders}) => {
    const orderCard = useRef(null)
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user) : ""
  

    useEffect(() => {
       M.Collapsible.init(orderCard.current)
    }, [])

    const OrderHistory = () => {
        return(
            <ul className="collapsible" ref={orderCard}>
                {orders.map(item => {
                    return (
                        <li key={item._id}>
                           <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                           <div className="collapsible-body">
                               <h5>Total: Rs {item.total}</h5>
                               {item.products.map(pItem => {
                                   return (
                                      <div key={pItem.product._id}> 
                                       <h6>{pItem.product.name} x {pItem.quantity}</h6>
                                      </div> 
                                   )
                               })}
                           </div>
                        </li>
                    )
                })}
            </ul>
        ) 
    }
    console.log(orders)

    return (
        <div className='container'>
           <div className='center-align' style={{marginTop: '10px' ,backgroundColor: '#1565c0', padding: '3px'}}>
               <h4>{user.name}</h4>
               <h4>{user.email}</h4>
               <h3>Order History</h3>
               {orders.length === 0  ? 
                 <div className='container'>
                    <h5>You have no order hsiory</h5>
                 </div>
               : <OrderHistory />
              }
              {user.role === "root" && (
                <UserRoles />
              )}
           </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const {token} = parseCookies(ctx)
    if(!token) {
        const {res} = ctx
        res.writeHead(302, {Location: '/login'})
        res.end()
    }

    const res = await fetch(`${baseUrl}/api/orders`, {
        headers: {
            "Authorization":token
        }
    })

    const data = await res.json()
    console.log(data)

    return {
        props: {orders: data}
    }
}

export default Account
