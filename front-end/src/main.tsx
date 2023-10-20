import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './components/Login.tsx'
import Layout from './components/Layout.tsx'
import Ranking from './components/Ranking'
import Home from './components/Home.tsx'

import  { Play }  from './components/Play'
import { BrowserRouter as Router , Routes, Route } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Layout/> }>
          <Route path="play" element={<Play/>}>
          </Route>
          <Route path="ranking" element={<Ranking/>} />
          <Route path="home" element={<Home/>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)