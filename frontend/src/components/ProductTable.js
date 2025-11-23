import {useState, useEffect} from 'react'
import Header from './Header'
import SideBar from './SideBar'
import ProductRow from './ProductRow'
import Cookies from 'js-cookie'

function ProductTable() {
  const [data, setData] = useState([])
  const [id, setId] = useState(0)
  const [isEditing, setEiditing] =useState(false)
  const [viewHistory, setView] = useState(false)

  const [newstock, setNewstock] = useState("")
  const [brand, setBrand] = useState("")
  const [name, setName] = useState("")

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

  const onClickEdit = (id) => {
    setEiditing(true)
    setId(id)
  }

  const onViewHistory = (id) =>{
    setId(id)
    setView(true)
  }
  
      const onSubmitEdit = async (e) =>{
        e.preventDefault()
        const token = Cookies.get('jwt_token')
                
        const url=`https://inventory-management-jj3z.onrender.com/api/products/${id}`
        const details = {new_stock : newstock, brand, name, user_info:""}
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

  return (
    <div className='w-full h-[100vh]'>
        <Header/>
        <div className='w-full h-full flex'>
        {viewHistory && <SideBar id={id}/>}
        <div className='w-full flex flex-col justify-center items-center h-full'>
        <table className={`bg-white border border-gray-300 mb-3`}>
            <thead>
                <tr className="bg-gray-100">
                <th className="py-2 px-4 border">NAME</th>
                <th className="py-2 px-4 border">Brand</th>
                <th className='py-2 px-4 border'>AVAIBILITY</th>
                <th className='py-2 px-4 border'>More Info</th>
                </tr>
            </thead>
        <tbody>
          {data.map(product=>
            <ProductRow product={product} key={product.id} onClickEdit={onClickEdit} onViewHistory={onViewHistory}/>
          )}
        </tbody>
        </table>
        {isEditing && 
        <form onSubmit={onSubmitEdit} className='flex flex-col justify-center items-center border border-solid-gray-200 w-[300px] h-[250px] rounded'>
          <h1 className='text-green-400 text-lg'>Edit Form</h1>
          <input type='text' placeholder='Name' className='bg-gray-200 m-2 p-1 rounded' value={name} onChange={(e)=>setName(e.target.value)}/>
          <input type='text' placeholder='Brand' className='bg-gray-200 m-2 p-1 rounded' value={brand} onChange={(e)=>setBrand(e.target.value)}/>
          <input type='text' placeholder='New Stock' className='bg-gray-200 m-2 p-1 rounded' value={newstock} onChange={(e)=>setNewstock(e.target.value)}/>
          <button type='submit' className='bg-blue-500 rounded text-white w-[80px]'>Submit</button>
        </form>}
    </div>
    </div>
    </div>
  )
}

export default ProductTable