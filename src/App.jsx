import './App.css'
import {Routes, Route} from 'react-router-dom'
import CommunityBrews from './views/CommunityBrews'
import Home from './views/Home'
import TeaDetails from './views/TeaDetails'
import Login from './views/Login'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import UserProfile from './views/UserProfile'
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={ user? <Home/> : <Login/>}/>
        <Route path='/user/:id' element={ user? <UserProfile/> : <Login/> }></Route>
        <Route path='/community-brews' element={<CommunityBrews/>}></Route>
        <Route path="/tea/:id" element={<TeaDetails />} />
      </Routes>
    </>
  )
}

export default App
