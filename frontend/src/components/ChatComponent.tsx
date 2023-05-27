import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { websocketState } from "../state/websocketState";
import { Socket } from "socket.io-client";
import { currentPlayerState } from "../state/currentPlayerState";
import { Link } from "react-router-dom";
import { socketReadyState } from "../state/socketReadyState";
import { chatMessagesState } from "../state/chatMessagesState";

function ChatComponent() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const socket = useRecoilValue<Socket>(websocketState);
    //const [socketReady, setSocketReady] = useState(socketReadyState);

    const [messages, setMessages] = useRecoilState(chatMessagesState);

    const messagesDivRef = useRef<HTMLDivElement>(null);

    function onMessageSend(e: any) {
        e.preventDefault();
        if (!!textFieldRef.current) {
            let text = textFieldRef.current.value.trim();
            if(text === "") {
                return;
            }
            socket.send(text);
            textFieldRef.current.value = "";
        }
    }


    function ChatEntry(props: any) {
        const message = props.message;
        console.log(message);
        return (
            message.type === "message" ?
                <div>
                    <span className="mr-1 text-neutral-100  font-medium">
                        <Link to={`/player/${message.data.player_id}`}>
                            {`${message.data.username}:`}
                        </Link>
                    </span>
                    <span className="text-neutral-300 font-semibold">
                        {message.text}
                    </span>
                </div>
                :
                <div>
                    {message.log}
                </div>
        );
    }




    function messageHandler(payload: any) {
        setMessages(oldState => [...oldState, { ...payload, type: "message" }]);
    }

    function logHandler(payload: any) {
        setMessages(oldState => [...oldState, { log: payload, type: "log" }]);
    }

    useLayoutEffect(()=>{
        messagesDivRef.current!.scrollTop = messagesDivRef.current!.scrollHeight;
    },[messages]);

    useEffect(() => {
        socket.on("message", messageHandler);
        socket.on("log", logHandler);

        return () => {
            socket.removeListener("message", messageHandler);
            socket.removeListener("log", logHandler);
        }
    }, [socket])


    return (
        <div className="h-full flex flex-col   bg-neutral-700">
            <div ref={messagesDivRef} className="shrink-0 h-[0] grow-[20] overflow-auto ">
                {
                    messages.map((message) => (
                        <ChatEntry message={message} />
                    ))
                }
            </div>
            <div className="flex bg-neutral-600">
                <div className="text-sky-300 font-medium">Группа: </div>
                <form className="w-full ml-2" onSubmit={onMessageSend}>
                    <input className=" w-full bg-neutral-500 text-neutral-200 font-semibold" type="text" ref={textFieldRef} />
                </form>
            </div>
        </div>
    )
}

export default ChatComponent;