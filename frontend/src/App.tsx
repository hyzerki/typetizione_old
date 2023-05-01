import { useState } from 'react'
import './App.css'
import TypeForm from './TypeForm'
import reactLogo from './assets/react.svg'
import MainPage from './pages/MainPage'
import { Route, Router, Routes } from 'react-router-dom'

function App() {
    return (
        <div className='h-screen flex flex-col'>
            <nav className="flex flex-row h-14 gap-x-40 bg-neutral-700">
                <div>
                    settings
                </div>
                <div className='w-[5em]'>
                    <div className="absolute italic font-bold text-3xl">
                        <div>type</div>
                        <div>_tizione</div>
                    </div>
                </div>
                <div>
                    ladder
                </div>
                <div>friends</div>
            </nav>
            <MainPage />
        </div>
    )
}



export default App;

