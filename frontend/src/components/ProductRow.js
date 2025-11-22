import {useState} from 'react'
import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'
import Cookies from 'js-cookie'

function ProductRow({product}) {
    const [stock, setStock] = useState(product.stock)
    const [brand, setbrand] = useState(product.brand)
    const [name, setName] = useState(product.name)
     
    const onClickEdit = async () =>{
        const token = Cookies.get('jwt_token')
                
        const url=`https://inventory-management-jj3z.onrender.com/api/products/${product.id}`
        const details = {new_stock : stock, brand, name, user_info:""}
        const options = {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "authorization" : `breaer ${token}`},
            body : JSON.stringify(details)
            }
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)

    }

    const status = product.stock === 0 ? 'Out of Stock' : 'In Stock';
    const colorClass = product.stock === 0 ? 'text-red-600' : 'text-green-600';

  return (
    <tr key={product.id}>
            <td className="py-2 px-4 border">{product.name}</td>
            <td className="py-2 px-4 border">{product.brand}</td>
            <td className={`py-2 px-4 border ${colorClass}`}>{status}</td>
    <td className='py-2 px-4 border flex justify-around w-[160px]'>
              <Popup
              trigger={
                <button type="button" className="bg-green-400 w-[50px] rounded text-white">
                  Edit
                </button>
              }
              position="bottom left"
            >
              <div className='h-[150px] w-[200px] p-1 flex flex-col justify-start items-center'>
                <input type="text" placeholder='Enter stock' value={stock} onChange={(e)=>setStock(e.target.value)} className='bg-gray-100 p-1 mb-2'/>
                <input type='text' placeholder='Enter Name' value={name} onChange={(e)=>setName(e.target.value)} className='bg-gray-100 p-1 mb-2'/>
                <input type='text' placeholder='Enter Brand' value={brand} onChange={(e)=>setbrand(e.target.value) } className='bg-gray-100 p-1 mb-2'/>
                <button onClick={onClickEdit} className='bg-blue-500 ml-auto mr-auto text-white rounded w-[70px]'>Submit</button>
              </div>
              </Popup>
              <button className='bg-red-400 w-[70px] rounded'>Delete</button>
            </td>
    </tr>
  )
}

export default ProductRow