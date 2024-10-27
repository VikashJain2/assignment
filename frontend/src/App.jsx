import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserForm from './pages/UserForm'
import SuccessPage from './pages/SuccessPage'
import UserOtp from './pages/UserOtp'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<UserForm/>}/>
    <Route path='/otp/:id' element={<UserOtp/>}/>

    <Route path='/success/:id' element={<SuccessPage/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
