import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";
import { chatMessagesState } from "../state/chatMessagesState";
import { currentPlayerState } from "../state/currentPlayerState";
import { socketReadyState } from "../state/socketReadyState";
import { websocketState } from "../state/websocketState";

function ChatComponent() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const textFieldRef = useRef<HTMLInputElement>(null);
    const socket = useRecoilValue<Socket>(websocketState);
    const [messages, setMessages] = useRecoilState(chatMessagesState);

    const messagesDivRef = useRef<HTMLDivElement>(null);


    //const [socketReady, setSocketReady] = useState(socketReadyState);




    function onMessageSend(e: any) {
        e.preventDefault();
        if (!!textFieldRef.current) {
            let text = textFieldRef.current.value.trim();
            if (text === "") {
                return;
            }
            socket.send(text);
            textFieldRef.current.value = "";
        }
    }


    function ChatEntry(props: any) {
        const message = props.message;
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

    useEffect(() => {
        socket.on("message", messageHandler);
        socket.on("log", logHandler);

        return () => {
            socket.removeListener("message", messageHandler);
            socket.removeListener("log", logHandler);
        }
    }, [socket])


    useLayoutEffect(() => {
        if (!!messagesDivRef.current) {
            messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
        }
    }, [messages]);




    return (
        <div className="h-full flex flex-col   bg-neutral-700">
            {!!currentPlayer ?
                <Fragment>
                    <div ref={messagesDivRef} className="shrink-0 h-[0] grow-[20] overflow-auto ">
                        {
                            messages.map((message, index) => (
                                <ChatEntry key={index} message={message} />
                            ))
                        }
                    </div>
                    <div className="flex bg-neutral-600">
                        <div className="text-sky-300 font-medium">Группа: </div>
                        <form className="w-full ml-2" onSubmit={onMessageSend}>
                            <input className=" w-full bg-neutral-500 text-neutral-200 font-semibold" type="text" ref={textFieldRef} />
                        </form>
                    </div>
                </Fragment>
                :
                <div>
                    Войдите, чтобы использовать чат
                </div>
            }

        </div>
    )
}

export default ChatComponent;