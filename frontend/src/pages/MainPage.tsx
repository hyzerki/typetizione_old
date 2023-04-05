import React, { MouseEventHandler } from "react";
import SideOver from "../components/SideOver"
import TypeForm from "../TypeForm";

function MainPage() {
    const [open, setOpen] = React.useState(false)


    function openSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(true);
    }
    function closeSideover(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        setOpen(false);
    }

    return (
        <div className="flex h-screen">
            <div className="w-full">
                <TypeForm fontSize="30px"/>
            </div>
            <div className="w-[300px]">
                
            </div>
            <input type="button"
                    onClick={openSideover}
                    value="Начать игру"
                    className="absolute bottom-3 right-3 w-[360px] h-[60px] inline-flex justify-center rounded-md bg-green-600 text-sm font-semibold text-white shadow-sm hover:bg-green-500" />
            <SideOver isOpen={open} setOpen={openSideover} setClose={closeSideover} />
        </div>
    );
}

export default MainPage;