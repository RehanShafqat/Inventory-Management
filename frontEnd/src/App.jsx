import { BrowserRouter, Routes, Route } from "react-router-dom"
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import Home from './Pages/Home';
import ForgotPassword from "./Pages/ForgotPassword";
const App = () => {
  return (
    <>

      <BrowserRouter>

        <Routes>
          <Route path='/register' element={<Registration />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/forgot' element={<ForgotPassword />}></Route>
        </Routes>



      </BrowserRouter>



    </>
  )
};


export default App
