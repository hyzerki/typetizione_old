import { Link, useNavigate, useParams } from "react-router-dom";
import TypeForm from "../../components/TypeForm/TypeForm";
import { Socket, io } from "socket.io-client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayerState } from "../../state/currentPlayerState";
import PlayerService from "../../service/playerService";

export default function GamePage() {
    const {id} = useParams();
    console.log("id ", id);
    const currentPlayer = useRecoilValue(currentPlayerState);
    const [socketError, setSocketError] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isResult, setIsResult] = useState(false);
    const [textToType, setTextToType] = useState("");
    const [place, setPlace] = useState(-1);
    const navigate = useNavigate();
    const [gameSocket, setGameSocket] = useState<Socket>();

    function handleResult(res: any) {
        // alert(res);
        console.log(res);
        setIsResult(true);
        setPlace(res.place)
    }

    function handleStart(ttt: any) {
        setTextToType(ttt.text);
        setIsStarted(true);
        console.log(ttt.text);
    }

    useEffect(() => {
        //console.log("ccc", id);
        // let gamId = +id;
        let socket = io(`${import.meta.env.VITE_API_BASE_URL}/playgame`,
            {
                forceNew:true,
                query: {
                    game_id: id,
                    player_id: currentPlayer.id,
                },
            })
        socket.on('disconnect', () => {
            //navigate("/");
            alert("DS");
            console.log("Disconnect");
        });
        socket.on("game_start", handleStart)
        socket.on("result", handleResult);
        console.log("Сокет изменился");
        setGameSocket(socket)
        return () => {
            socket.removeListener("game_start", handleStart)
            socket.removeListener("result", handleResult);
            socket.close();
        }
    }, []);

    function finish() {
        setIsFinished(true);
        gameSocket!.emit("text_finished");
    }

    return (
        <div className="h-screen bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">

                </div>
                <div className="col-span-2  bg-neutral-800">
                    <div className="h-full flex flex-col">
                        {isStarted ?

                            isFinished ?
                                place > 0 ?
                                    <div className="text-5xl text-white font-extrabold m-auto">
                                        <div>
                                            Вы заняли {place} место!
                                        </div>
                                        <div>
                                            <Link to="/" className="underline">На Главную</Link>
                                        </div>
                                    </div>
                                    :
                                    <div className="text-5xl text-white font-extrabold m-auto">
                                        Ожидание результатов
                                    </div>
                                :
                                <TypeForm
                                    onTextComplete={finish}
                                    textToType="Алиса уже почти догнала его."
                                    fontSize="30px" />
                            :
                            <div className="text-5xl text-white font-extrabold m-auto">
                                Ожидание игроков
                            </div>
                        }

                    </div>
                </div>
                <div className="h-full p-10 pb-24">

                </div>
            </div>
        </div>
    );
}