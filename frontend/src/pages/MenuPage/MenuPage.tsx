import React, { useLayoutEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
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

function MenuPage() {
    const [open, setOpen] = React.useState(false)
    const currentPlayer = useRecoilValue(currentPlayerState);
    const socketEror = useRecoilValue(socketErrorState);


    function openSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(true);
    }
    function closeSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(false);
    }

    async function logout() {
        await AuthService.logout();
    }



    return (
        <div className='h-screen flex flex-col'>
            {
                !!currentPlayer && socketEror ?
                    <div className="text-neutral-100 bg-red-800">Подключение к сети typetizione</div>
                    :
                    null
            }
            <nav className="flex  flex-row h-14 gap-x-40 bg-neutral-700">
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
                    <Link to="/ladder">ladder</Link>
                </div>
                <div>
                    <Link to="/friends">friends</Link>
                </div>
            </nav>

            <div className="absolute bottom-3 left-3  ">
                <Party />
            </div>

            <input type="button"
                onClick={openSideover}
                value="Начать игру"
                className="absolute bottom-3 right-3 w-[360px] h-[60px] inline-flex justify-center rounded-md bg-green-600 text-sm font-semibold text-white shadow-sm hover:bg-green-500" />
            <SideOver isOpen={open} setOpen={openSideover} setClose={closeSideover} />


            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/auth/*" element={<AuthPage />} />
                <Route path="/player/:id" element={<PlayerPage/>}/>
            </Routes>

        </div>
    )
}

export default MenuPage;