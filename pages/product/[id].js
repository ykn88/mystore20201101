import {useRouter} from 'next/router'
import baseUrl from '../../helpers/baseUrl'
import {useRef, useEffect, useState} from 'react'
import {parseCookies} from 'nookies'
import cookie2 from 'js-cookie'

const Product = ({product}) => {
    
    const router = useRouter()
    const modalRef = useRef(null)
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user) : ""
    const [quantity, setQuantity] = useState(1)
    
    useEffect(() => {
       M.Modal.init(modalRef.current)
    }, [])
    
    if(router.isFallback) {
        return (
            <h3>loading...</h3>
        )
    }

    const addToCart = async () => {
        const res = await fetch(`${baseUrl}/api/cart`, {
            method: "PUT",
            headers: {
              "Content-Type":"application/json",
              "Authorization":cookie.token
            },
            body: JSON.stringify({
              quantity,
              productId: product._id
            })
        })

        const data = await res.json()
        if(data.error) {
          M.toast({html:data.error, classes: "red"})
          cookie2.remove('user')
          cookie2.remove('token')
          router.push('/login')
        }
        M.toast({html:data.message, classes: "green"})
    }

    const deleteProduct = async() => {
        const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
            method: "DELETE"
        })
        await res.json()
        router.push('/')
    }

    const getModal = () => {
        return (
            <div id="modal1" className="modal" ref={modalRef}>
                <div className="modal-content">
                   <h4>{product.name}</h4>
                   <p>Are you sure to delete</p>
                </div>
                <div className="modal-footer">
                <button className="btn waves-effect waves-light #1565c0 blue darken-3">Cancel</button>
                <button className="btn waves-effect waves-light #d32f2f red darken-2" onClick={deleteProduct}>
                    Yes
                </button>
                </div>
            </div>
        )
    }

    return (
        <div className='container center-align'>
           <h3>{product.name}</h3>  
           <img src={product.mediaUrl} style={{width: '50%'}}/>
           <h5>&#8377; {product.price}</h5>  
           <input 
            type="number"
            style={{width: "400px", margin: "10px"}}
            min='1'
            value={quantity}
            placeholder="Quantity"
            onChange={e => setQuantity(Number(e.target.value))}
           />
           {
            user ?
              <button className="btn waves-effect waves-light #1565c0 blue darken-3"
                onClick = {addToCart}
              >Add
                <i className="material-icons right">add</i>
              </button>        
             : 
              <button className="btn waves-effect waves-light #1565c0 blue darken-3"
                onClick = {() => router.push('/login')}
              >Login to add
                <i className="material-icons right">add</i>
              </button>
           }
           <p className="left-align">
               {product.description}
            </p>        
            {(user && user.role !== 'user') && (
                <button data-target="modal1" className="btn modal-trigger waves-effect waves-light #d32f2f red darken-2">Delete
                   <i className="material-icons right">delete</i>
                </button>
            )}  
            {getModal()}        
        </div>
    )
}

// export async function getServerSideProps({params:{id}}) {
//   const res = await fetch(`${baseUrl}/api/product/${id}`)
//   const data = await res.json()
//   return {
//     props: {product: data}
//   }
// }

export async function getStaticProps({params: {id}}) {
    const data = await (await fetch(`${baseUrl}/api/product/${id}`)).json()
    return {
      props: {
        product: data
      }
    }
}

export async function getStaticPaths() {
    return {
      paths: [
        { params: {id: '5f9a605a926fc8204d9b32b0'} } 
      ],
      fallback: true 
    };
  }

export default Product
