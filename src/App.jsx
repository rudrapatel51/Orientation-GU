import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserForm from './Components/UserForm'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QRCodeScanner from './Components/QRCodeScanner'
import NoPage from "./Components/NoPage"
import Login from './Authentication/Login'
import QrLogin from './Authentication/QrLogin'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/scan" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
