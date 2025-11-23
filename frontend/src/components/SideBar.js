import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'

function SideBar({id}) {
   
    const [data, setData] = useState([])

    useEffect(()=>{
         const token = Cookies.get('jwt_token')
        const getHistory = async () =>{
           const url  = `https://inventory-management-jj3z.onrender.com/api/products/${id}/history`
        const options = {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
                "authorization" : `breaer ${token}`}
            }
        const response = await fetch(url, options)
        const data = await response.json()
       
        setData(data)
        console.log(data)
        }
       getHistory()
    },[id])

  return (
    <div className='w-[25vw] h-full bg-gray-300 flex flex-col justify-center items-center'>
       {data.map(each => (
        <li key={each.id} className='m-1 p-2 border border-solid-black'>
            <h2>History</h2>
            <p>oldQuantity : {each.old_quantity}</p>
            <p>NewQuantity : {each.new_quantity}</p>
            <p>{each.change_date.split(" ")[0]}</p>
        </li>
       ))}
    </div>
  )
}

export default SideBar