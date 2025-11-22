import React from 'react'
import { FiSearch } from "react-icons/fi";

function Header() {
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
        <div className='w-[50%] flex justify-center'>
            <button className='bg-white rounded w-[70px]'>Export</button>
        </div>
    </nav>
  )
}

export default Header