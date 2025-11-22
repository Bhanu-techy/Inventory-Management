import {useState, useEffect} from 'react'
import Header from './Header'
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'

function ProductTable() {
  const [data, setData] = useState([])
  const [stock, setStock] = useState(0)
  const [info, setInfo] = useState("")

  const overlayStyles = {
 backgroundColor: '#ffff',
}

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
                <th className="py-2 px-4 border">CATEGORY</th>
                <th className='py-2 px-4 border'>AVAIBILITY</th>
                <th className='py-2 px-4 border'>Modify</th>
                </tr>
            </thead>
        <tbody>
          {data.map(product=>
            { const status = product.stock === 0 ? 'Out of Stock' : 'In Stock';
              const colorClass = product.stock === 0 ? 'text-red-600' : 'text-green-600';
            return (
             <tr key={product.id}>
            <td className="py-2 px-4 border">{product.name}</td>
            <td className="py-2 px-4 border">{product.category}</td>
            <td className={`py-2 px-4 border ${colorClass}`}>{status}</td>
            <td className='py-2 px-4 border flex justify-around w-[160px]'>
              <Popup
              trigger={
                <button type="button" className="trigger-button">
                  Trigger
                </button>
              }
              position="bottom left"
            >
              <div className='h-[100px] p-2'>
                <input type="text" placeholder='Enter stock' onChange={(e)=>setStock(e.target.value)} className='bg-gray-100 p-1 mb-2'/>
                <input type='text' placeholder='userinfo'/>
              </div>
              </Popup>
              <button className='bg-red-400 w-[70px] rounded'>Delete</button>
            </td>
            </tr>)}
          )}
        </tbody>
        </table>
    </div>
    </div>
  )
}

export default ProductTable