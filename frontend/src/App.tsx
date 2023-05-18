import { useState } from 'react'
import { Link, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import reactLogo from './assets/react.svg'
import LoginPage from './pages/MenuPage/AuthPage/AuthPage'
import MenuPage from './pages/MenuPage/MenuPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
    return (
            <Routes>
                <Route path='/*' element={<MenuPage />} />
                {/* <Route path='*' element={<NotFoundPage />} /> */}
            </Routes>
    )
}



export default App;

