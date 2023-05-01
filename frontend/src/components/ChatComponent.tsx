import React from "react";

function ChatComponent(){
    return(
        <div className="h-full flex flex-col  bg-neutral-700">
            <div className="h-full">

            </div>
            <div className="flex bg-neutral-600">
                <div className="">Группа: </div>
                <input className="ml-2 w-full bg-neutral-500" type="text"/>
            </div>
        </div>
    )
}

export default ChatComponent;