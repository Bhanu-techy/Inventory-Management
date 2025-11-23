import {useState} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";

function Header({ getFilterProducts}) {

  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")

  const navigate = useNavigate()

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    navigate("/login")
  }

  const onClickSearch= () => {
    getFilterProducts(query, category)
    console.log(category)
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
            <button className='bg-white rounded w-[140px]'>Add new Product</button>
        </div>
        <div className='md:w-[50%] sm:w-[100%] flex justify-around'>
            <button className='bg-white rounded w-[70px]' onClick={onClickExport}>Export</button>
            <button className='bg-blue-500 rounder w-[70px] text-white' onClick={onClickLogout}>Logout</button>
        </div>
        
    </nav>
  )
}

export default Header