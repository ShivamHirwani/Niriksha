import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import { Navbar } from './components';

import {Home, Login} from './pages';
import './App.css'

function App() {

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  useEffect(() => {
    if(theme === "dark"){
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    };
    localStorage.setItem("theme", theme);
  },[theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light":"dark")

  return (
    <main>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
      </Routes>
    </main>
  )
}

export default App