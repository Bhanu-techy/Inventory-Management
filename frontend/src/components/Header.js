import React from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";

function Header() {

  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate("/login")
  }


  const onClickExport = async () => {
      try {
        const token = Cookies.get('jwt_token')
        const url ='https://inventory-management-jj3z.onrender.com/api/products/export'
        const options = {
          method : "GET",
          headers : {
              Authorization: `Bearer ${token}`, }
          }
        const response = await fetch(url, options)
          console.log(response)
        if (!response.ok) {
          throw new Error("Failed to download CSV");
        }

        const blob = await response.blob();
        const urllink = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urllink;
        a.download = "products.csv";
        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(urllink);
        } catch (error) {
          console.error("CSV Download Error:", error);
        }
    }

  return (
    <nav className='flex justify-between items-center w-full p-3 bg-gray-300'>
        <div className='flex justify-around items-center w-[50%] rounded-lg'>
           <div className='bg-white  p-1 flex justify-around'>
             <input type="search" className='bg-transparent hover:border-transparent'/>
             <button>
                <FiSearch size={20}/>
             </button>
             
           </div>
           <select>
                <option value="grocery">Grocery</option>
                <option value="dairy">Dairy</option>
                <option value="personal care">Personal care</option>
             </select>
            <button className='bg-white rounded w-[140px]'>Add new Product</button>
        </div>
        <div className='w-[50%] flex justify-around'>
            <button className='bg-white rounded w-[70px]' onClick={onClickExport}>Export</button>
            <button className='bg-blue-500 rounder w-[70px] text-white' onClick={onClickLogout}>Logout</button>
        </div>
        
    </nav>
  )
}

export default Header