import './App.css'
import {Routes, Route} from 'react-router-dom'
import CommunityBrews from './views/CommunityBrews'
import Home from './views/Home'
import TeaDetails from './views/TeaDetails'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Register from './views/Register'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import UserProfile from './views/UserProfile'
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path='/' element={ user? <Dashboard/> : <Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        {/* <Route path='/dashboard' element={ user? <Dashboard/> : <Home/>}/> */}
        <Route path='/user/:id' element={ user? <UserProfile/> : <Login/> }></Route>
        <Route path='/community-brews' element={<CommunityBrews/>}></Route>
        <Route path="/tea/:id" element={<TeaDetails />} />
      </Routes>
    </>
  )
}

export default App
