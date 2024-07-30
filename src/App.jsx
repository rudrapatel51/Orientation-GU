import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserForm from './Components/UserForm'
import CheckQR from './Components/CheckQR'
import QRCodeScanner from './Components/QRCodeScanner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UserForm />
      <CheckQR />
      <QRCodeScanner />
    </>
  )
}

export default App
