import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function Login() {
  const [button, setButton] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrmsg] = useState("")
  const [showErr, setShowErr] = useState(false)

  const navigate = useNavigate()

  const onClickLogin = async () =>{
    const url = 'https://inventory-management-jj3z.onrender.com/login'
    const userDetails = {name, password}
   
    const options = {
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify(userDetails)
    }
    const response= await fetch(url, options)
    const data = await response.json()
    
    if (response.ok) {
      Cookies.set('jwt_token', data.jwtToken, {expires: 30})
      navigate("/", {replace : true})
    } else {
      setErrmsg(data.error_msg)
      setShowErr(true)
    }
  }

  return (
    <div className='w-full h-[100vh] flex justify-center items-center'>
      <div className='w-[40%] border border-solid-gray h-[400px] flex flex-col justify-center items-center p-3'>
        <div className='w-[50%] flex justify-around m-3'>
          <button className={`w-[100px] bg-gray-500 text-white rounded h-[32px] mr-2`} onClick={()=>setButton("Login")}>Login</button>
          <button className={`w-[100px] bg-gray-500 text-white rounded h-[32px]`} onClick={()=>setButton("Register")}>Register</button>
        </div>
        <div className='m-3'>
          <div className='flex flex-col m-2'>
            <label htmlFor='name'>NAME</label>
          <input type='text' id="name" className='bg-gray-200 m-1 w-[300px] rounded h-[40px] p-1'
           value={name} onChange={(e)=>setName(e.target.value)}/>
          </div>
          <div className='flex flex-col m-2'>
            <label htmlFor='password'>PASSWORD</label>
          <input type='password' id="password" className='bg-gray-200 m-1 w-[300px] rounded h-[40px] p-1'
           value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
        </div>
       {showErr && <p className='text-red-500 mb-2'>! {errMsg}</p>}
       {button === "Login" && <button className='w-[100px] h-[30px] bg-blue-500 text-white rounded' onClick={onClickLogin}>Login</button>}
       {button === "Register" && <button className='w-[100px] h-[30px] bg-blue-500 text-white rounded'>Register</button>
       }
      </div>
    </div>
  )
}

export default Login