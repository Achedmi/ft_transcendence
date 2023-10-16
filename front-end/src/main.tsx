  import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './components/Login.tsx'
import Home from './components/Home'
import Ranking from './components/Ranking'
import  { Game1,Play, Game2}  from './components/Play'

import { BrowserRouter as Router , Routes, Route } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/> }>
          <Route path="play" element={<Play/>}>
            <Route path="game1" element={<Game1/>} />
            <Route path="game2" element={<Game2/>} />
          </Route>
          <Route path="ranking" element={<Ranking/>} />
          <Route path="home" element={<><h1>home</h1></>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)
