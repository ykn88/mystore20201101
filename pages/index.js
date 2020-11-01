import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'

function Home({products}) {

  const productList = products.map(product => {
    return (
      <div className="card pcard" key={product._id}>
      <div className="card-image">
        <img src={product.mediaUrl} />
        <span className="card-title white-text">{product.name}</span>
      </div>
      <div className="card-content">
        <p>&#8377; {product.price}</p>
      </div>
      <div className="card-action">
        <Link  href="/product/[id]" as={`/product/${product._id}`}>
          <a>View Product</a>
        </Link>
      </div>
    </div>
    )
  })

  return (
    <div className="rootcard">
      {productList}
    </div>
  )
}

// export async function getStaticProps() {
//   const data = await (await fetch(`${baseUrl}/api/products`)).json()
//   return {
//     props: {
//       products: data
//     }
//   }
// }

export async function getServerSideProps() {
  const data = await (await fetch(`${baseUrl}/api/products`)).json()
  return {
    props: {
      products: data
    }
  }
}

export default Home
