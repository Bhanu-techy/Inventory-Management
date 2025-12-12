import {useState} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'

function Header({ getFilterProducts}) {

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [name, setName] = useState("")
  const [addcategory, setAddCategory] = useState("")
  const [stock, setStock] = useState(0)

  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate("/login")
  }

  const onClickSearch= () => {
    getFilterProducts(query, category)
    console.log(category)
  }


    const onClickDropDown = (e) => {
      setCategory(e.target.value)
      getFilterProducts(query, category)
   
    }

  return (
    <nav className='flex md:flex-row justify-between items-center w-[100vw] p-3 bg-gray-300 md:h-[10vh] sm:flex-col sm:h-[15vh]'>
        <div className='flex flex-row justify-around items-center md:w-[50%] sm:w-[100%]'>
           <div className='bg-white  p-1 flex justify-around'>
             <input type="search" className='bg-transparent hover:border-transparent rounded-lg' value={query} onChange={(e)=>setQuery(e.target.value)}/>
             <button onClick={onClickSearch}>
                <FiSearch size={20}/>
             </button>
             
           </div>
           <select onClick={onClickDropDown}>
                <option value="Grocery">Grocery</option>
                <option value="Dairy" >Dairy</option>
                <option value="Personal care">Personal care</option>
             </select>
            
            <div className="popup-container">
          <Popup
            trigger={
              <button className='bg-white rounded w-[140px]'>Add new Product</button>
            }
            position="bottom left"
          >
            <p>React is a popular and widely used programming language</p>
          </Popup>
 </div>
        </div>
        <div className='md:w-[50%] sm:w-[100%] flex justify-around'>
           
            <button className='bg-blue-500 rounder w-[70px] text-white' onClick={onClickLogout}>Logout</button>
        </div>
        
    </nav>
  )
}

export default Header