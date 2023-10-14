  import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './components/Login.tsx'
import Home from './components/Home'
import NavBar from './components/NavBar'

import { BrowserRouter, Routes, Route } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/>} />
        <Route path='/nav' element={<NavBar/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
