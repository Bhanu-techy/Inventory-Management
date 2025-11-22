import {useState, useEffect} from 'react'
import Header from './Header'
import Cookies from 'js-cookie'

function ProductTable() {
  const [data, setData] = useState([])

  useEffect(()=>{
    const getProducts = async () =>{
       const token = Cookies.get('jwt_token')
        console.log(token)
      const url='https://inventory-management-jj3z.onrender.com/api/products'
      const options = {
        method : "GET",
        headers : {
          "authorization" : `breaer ${token}`}
      }
      const response = await fetch(url, options)
      const data = await response.json()
     
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
                <th className="py-2 px-4 border">Product</th>
                <th className="py-2 px-4 border">Description</th>
                <th className='py-2 px-4 border'>Example</th>
                </tr>
            </thead>
        <tbody>
          
            <tr>
            <td className="py-2 px-4 border">each</td>
            <td className="py-2 px-4 border">each</td>
            <td className="py-2 px-4 border">each</td>
            </tr>
        
        </tbody>
        </table>
    </div>
    </div>
  )
}

export default ProductTable