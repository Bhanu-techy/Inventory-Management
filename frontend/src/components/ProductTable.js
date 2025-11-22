import {useState, useEffect} from 'react'
import Header from './Header'
import ProductRow from './ProductRow'
import Cookies from 'js-cookie'

function ProductTable() {
  const [data, setData] = useState([])

  useEffect(()=>{
    const getProducts = async () =>{
    const token = Cookies.get('jwt_token')
        
    const url='https://inventory-management-jj3z.onrender.com/api/products'
    const options = {
        method : "GET",
        headers : {
          "authorization" : `breaer ${token}`}
      }
      const response = await fetch(url, options)
      const data = await response.json()
      setData(data)
    }
    getProducts()
  },[])

  return (
    <div className='w-full h-[100vh]'>
        <Header/>
        <div className='w-full flex justify-center items-center h-full'>
        <table className={`bg-white border border-gray-300`}>
            <thead>
                <tr className="bg-gray-100">
                <th className="py-2 px-4 border">NAME</th>
                <th className="py-2 px-4 border">Brand</th>
                <th className='py-2 px-4 border'>AVAIBILITY</th>
                <th className='py-2 px-4 border'>Modify</th>
                </tr>
            </thead>
        <tbody>
          {data.map(product=>
            <ProductRow product={product} key={product.id}/>
          )}
        </tbody>
        </table>
    </div>
    </div>
  )
}

export default ProductTable