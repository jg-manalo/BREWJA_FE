import './App.css'
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import CommunityBrews from './views/CommunityBrews'
import Home from './views/Home'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import Register from './views/Register'
import CreateBrew  from './views/CreateBrew';
import ForgotPassword from './views/ForgotPassword'
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import UserProfile from './views/UserProfile'
import StartBrewing from './views/StartBrewing'
import MyBrews from './views/MyBrews'
function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <BrowserRouter basename='/BREWJA_FE/'>
        <Routes>
          <Route path='/' element={ user? <Dashboard/> : <Home/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
          <Route path='create-brew' element={user? <CreateBrew/> : <Home/>}></Route>
          <Route path='start-brewing' element={user? <StartBrewing/> : <Login/>}></Route>
          <Route path='my-brews' element={user? <MyBrews/> :<Home/>}></Route>
          {/* <Route path='/dashboard' element={ user? <Dashboard/> : <Home/>}/> */}
          <Route path='/user/:id' element={ user? <UserProfile/> : <Login/> }></Route>
          <Route path='/community-brews' element={<CommunityBrews/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
