import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import SideOver from "../../components/SideOver";
import NotFoundPage from "../NotFoundPage";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";

function MenuPage() {
    const [open, setOpen] = React.useState(false)


    function openSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(true);
    }
    function closeSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(false);
    }

    return (
        <div className='h-screen flex flex-col'>
            <nav className="flex flex-row h-14 gap-x-40 bg-neutral-700">
                <div>
                    <Link to="/settings">Settings</Link>
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
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
            <div className="absolute bottom-3 left-3 flex flex-row gap-x-2 ">
                <div className="h-[60px] w-[60px] bg-red-600">

                </div>
                <div className="h-[60px] w-[60px] bg-red-100">

                </div>
                <div className="h-[60px] w-[60px] bg-red-100">

                </div>
                <div className="h-[60px] w-[60px] bg-red-100">

                </div>
                <div className="h-[60px] w-[60px] bg-red-100">

                </div>
            </div>

            <input type="button"
                onClick={openSideover}
                value="Начать игру"
                className="absolute bottom-3 right-3 w-[360px] h-[60px] inline-flex justify-center rounded-md bg-green-600 text-sm font-semibold text-white shadow-sm hover:bg-green-500" />
            <SideOver isOpen={open} setOpen={openSideover} setClose={closeSideover} />
        </div>
    )
}

export default MenuPage;