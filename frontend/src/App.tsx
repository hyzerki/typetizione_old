import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import reactLogo from './assets/react.svg'
import LoginPage from './pages/MenuPage/AuthPage/AuthPage'
import MenuPage from './pages/MenuPage/MenuPage'
import NotFoundPage from './pages/NotFoundPage'
import { currentPlayerState } from './state/currentPlayerState'
import { useRecoilValue, useRecoilState } from 'recoil'
import { io } from 'socket.io-client'
import { websocketState } from './state/websocketState'
import AuthService from './service/authService'
import { socketErrorState } from './state/socketErrorState'
import { socketReadyState } from './state/socketReadyState'

function App() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const [socket, setSocket] = useRecoilState(websocketState);
    const [socketError, setSocketError] = useRecoilState(socketErrorState);
    const [socketReady, setSocketReady] = useRecoilState(socketReadyState);

    useLayoutEffect(() => {
        AuthService.checkAuth().then(isAuth => {
            if (isAuth) {
                let sock = io(`${import.meta.env.VITE_API_BASE_URL}/lobby`,
                    {
                        query: {
                            player_id: currentPlayer.id,
                            username: currentPlayer.username
                        },
                        transports: ["websocket"]
                    }
                );
                setSocket(sock);
            }
        });
    }, []);

    useEffect(() => {
        socket.on('disconnect', () => {
            if (socket.disconnected && !!currentPlayer) {
                setSocketError(true);
                socket.on('connect', () => {
                    setSocketError(false);
                })
            }
        });
        socket.on("connect", ()=>{
            setSocketReady(true);
        })
    }, [socket]);

    return (
        <Routes>
            <Route path='/*' element={<MenuPage />} />
            {/* <Route path='*' element={<NotFoundPage />} /> */}
        </Routes>
    )
}



export default App;

