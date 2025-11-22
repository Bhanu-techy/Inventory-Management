import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./components/Login";
import ProductTable from "./components/ProductTable";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={Login}/>
    </Routes>
    </BrowserRouter>

  )
}

export default App;
