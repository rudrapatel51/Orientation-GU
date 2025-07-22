import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserForm from './Components/UserForm'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Authentication/Login'
import QRCodeGenerator from './Components/CheckQR'
import Succes from './Components/Succes'
import CheckQR from './Components/CheckQR';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/scan" element={<Login />} />
        <Route path="/succes" element={<Succes />} />
        <Route path="/qr" element={<QRCodeGenerator />} />
        <Route path="/attendance" element={<CheckQR />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
