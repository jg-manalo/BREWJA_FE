import './App.css'
import {Routes, Route} from 'react-router-dom'
import CommunityBrews from './views/CommunityBrews'
import Home from './views/Home'
import TeaDetails from './views/TeaDetails'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/community-brews' element={<CommunityBrews/>}></Route>
        <Route path="/tea/:id" element={<TeaDetails />} />
      </Routes>
    </>
  )
}

export default App
