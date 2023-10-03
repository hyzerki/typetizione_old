import React, { useLayoutEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import SideOver from "../../components/SideOver";
import AuthService from "../../service/authService";
import { currentPlayerState } from "../../state/currentPlayerState";
import AuthPage from "./AuthPage/AuthPage";
import MainPage from "./MainPage";
import { websocketState } from "../../state/websocketState";
import { io } from "socket.io-client";
import { socketErrorState } from "../../state/socketErrorState";
import Party from "./Party";
import PlayerPage from "./PlayerPage";
import LeaderBoardPage from "./LeaderBoardPage";
import useInterval from "../../hooks/useInterval";
import { XMarkIcon } from "@heroicons/react/20/solid";

function MenuPage() {
    const [open, setOpen] = React.useState(false)
    const currentPlayer = useRecoilValue(currentPlayerState);
    const socketEror = useRecoilValue(socketErrorState);
    const socket = useRecoilValue(websocketState);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    function openSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(true);
    }
    function closeSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(false);
    }

    async function logout() {
        await AuthService.logout();
    }

    function handleStartQueue() {
        setIsSearching(true);
    }

    function handleCancelQueue() {
        setIsSearching(false);
    }

    function handleGameFound(payload: any) {
        navigate("/play/" + payload.id);
    }

    function cancelQueue() {
        socket.emit("cancel_queue");
    }

    useLayoutEffect(() => {
        socket.on("start_queue", handleStartQueue);
        socket.on("cancel_queue", handleCancelQueue);
        socket.on("game_found", handleGameFound);
        return () => {
            socket.removeListener("start_queue", handleStartQueue);
            socket.removeListener("cancel_queue", handleCancelQueue);
            socket.removeListener("game_found", handleGameFound);
        }
    }, [socket])

    function CancelSearchBar() {
        const [searchTime, setSearchTime] = useState<number>(0);

        useInterval(updateTime, 1000);

        function updateTime(){
            setSearchTime(prevTime=> prevTime+=1);
        }

        return (
            <div className="text-white text-3xl">
                ПОИСК ИГРЫ {Math.floor(searchTime/60)}:{(searchTime%60 + "").padStart(2, "0")}
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-[url('/topographic.jpg')]">
            {
                !!currentPlayer && socketEror ?
                    <div className="text-neutral-100 bg-red-800">Подключение к сети typetizione</div>
                    :
                    null
            }
            <nav className="flex  flex-row h-14 gap-x-40 glass">
                <div className="flex align-middle items-center">
                    {
                        !!currentPlayer ?
                            <input type="button" onClick={logout} value="Выйти" className=" text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" />
                            :
                            <Link to="/auth/login" className="btn-green">Войти</Link>
                    }
                </div>
                <div className='w-[5em]'>
                    <div className="absolute italic font-bold text-3xl">
                        <Link to="/">
                            <div>type</div>
                            <div>_tizione</div>
                        </Link>
                    </div>
                </div>
                <div>
                    <Link to="/leaderboard">Таблица лидеров</Link>
                </div>
            </nav>

            <div className="absolute bottom-3 left-3  ">
                <Party />
            </div>


            <div className="absolute bottom-3 right-3 ">
                {
                    isSearching ?
                        <div className="flex items-center gap-5">
                            <CancelSearchBar />
                            <div>
                                <button type="button"
                                    onClick={cancelQueue}
                                    className=" w-[60px] h-[60px] inline-flex justify-center rounded-md bg-red-600 text-sm font-semibold text-white shadow-sm hover:bg-red-500" >
                                        <XMarkIcon/>
                                    </button>
                            </div>
                        </div>
                        :
                        <input type="button"
                            onClick={openSideover}
                            value="Начать игру"
                            className=" w-[360px] h-[60px] inline-flex justify-center rounded-md bg-lime-500/50 backdrop-blur-sm text-sm font-semibold text-white shadow-sm hover:bg-green-500" />
                }
            </div>
            <SideOver isOpen={open} setOpen={openSideover} setClose={closeSideover} />


            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/auth/*" element={<AuthPage />} />
                <Route path="/leaderboard" element={<LeaderBoardPage />} />
                <Route path="/player/:id" element={<PlayerPage />} />
            </Routes>

        </div>
    )
}

export default MenuPage;