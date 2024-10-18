import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserForm from './pages/UserForm'
import SuccessPage from './pages/SuccessPage'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<UserForm/>}/>
    <Route path='/success' element={<SuccessPage/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
