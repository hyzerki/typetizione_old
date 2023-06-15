import { Link, useNavigate, useParams } from "react-router-dom";
import TypeForm from "../../components/TypeForm/TypeForm";
import { Socket, io } from "socket.io-client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayerState } from "../../state/currentPlayerState";
import PlayerService from "../../service/playerService";
import Player from "../../model/player";
import useInterval from "../../hooks/useInterval";

export default function GamePage() {
    const { id } = useParams();
    const currentPlayer = useRecoilValue(currentPlayerState);
    const [socketError, setSocketError] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [textToType, setTextToType] = useState("");
    const [place, setPlace] = useState(-1);
    const navigate = useNavigate();
    const [gameSocket, setGameSocket] = useState<Socket>();
    const [players, setPlayers] = useState<any[]>([])
    const [waitTill, setWaitTill] = useState<number | null>(Date.now() + 30000);
    const [gameWontStart, setGameWontStart] = useState(false);

    function handleResult(res: any) {
        // alert(res);
        console.log(res);
        setResult(res);
        //setPlace(res.place)
    }

    function handleStart(ttt: any) {
        setTextToType(ttt.text);
        setIsStarted(true);
        console.log(ttt.text);
    }

    function handleSync(sync: any) {
        setWaitTill(sync.waitTill - (Date.now() - sync.sent));
    }

    function handlePlayerConnected(payload: any) {
        setPlayers(payload);
    }

    function handleGameWontStart() {
        setGameWontStart(true);
        setWaitTill(Date.now() + 3000);
        setTimeout(() => {
            navigate("/");
        }, 3000)
    }


    useEffect(() => {
        let socket = io(`${import.meta.env.VITE_API_BASE_URL}/playgame`,
            {
                forceNew: true,
                query: {
                    game_id: id,
                    player_id: currentPlayer.id,
                },
            })
        socket.on('disconnect', () => {
            navigate("/");
            console.log("Disconnect");
        });
        socket.on("game_start", handleStart)
        socket.on("result", handleResult);
        socket.on("sync", handleSync);
        socket.on("player_connected", handlePlayerConnected);
        socket.on("player_disconnected", handlePlayerConnected);
        socket.on("game_wont_start", handleGameWontStart)
        console.log("Сокет изменился");
        setGameSocket(socket)
        return () => {
            socket.removeListener("game_start", handleStart)
            socket.removeListener("result", handleResult);
            socket.removeListener("sync", handleSync);
            socket.removeListener("player_connected", handlePlayerConnected);
            socket.removeListener("player_disconnected", handlePlayerConnected);
            socket.removeListener("game_wont_start", handleGameWontStart)
            socket.close();
        }
    }, []);

    function finish(arg:any) {
        setIsFinished(true);
        gameSocket!.emit("text_finished", arg);
    }

    function Player(props: any) {
        const player = props.player;
        const [playerData, setPlayerData] = useState<Player | null>(null);

        useEffect(() => {
            PlayerService.getPlayerById(player.id).then(res => {
                setPlayerData(res);
            });
        }, [])

        return (
            <div className={`flex text-3xl ${player.isConnected ? "text-neutral-100" : "text-neutral-400"}`}>
                {
                    !!playerData ?
                        <div>{playerData.username} {playerData.rating}</div>
                        :
                        <div className="bg-neutral-300 w-4/6 rounded-xl h-9 mb-1"></div>
                }
            </div>
        )
    }

    function WaitTimer(props: any) {
        const gameWontStart = props.gameWontStart;
        const [timeNow, setTimeNow] = useState(Date.now());

        function timeTick() {
            setTimeNow(Date.now());
        }

        useInterval(timeTick, 1000)
        return (
            <div className="text-white text-xl">
                {gameWontStart ? "Возвращение в меню" : "Ожидание игроков"}: <span className="font-bold">{((props.waitTill - timeNow) / 1000).toFixed(0)}</span>
            </div>
        )
    }

    return (
        <div className="h-screen bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">

                </div>
                <div className="col-span-2  bg-neutral-800">
                    <div className="h-full flex flex-col">
                        {!gameWontStart ?
                            isStarted ?
                                isFinished ?
                                    result ?
                                        <div className="text-5xl text-white font-extrabold m-auto">
                                            <div>
                                                Вы заняли {result.place} место!
                                            </div>
                                            <div className="flex text-xl gap-1 items-stretch">
                                                <div>
                                                    [cpm: {result.cpm.toFixed(2)}]
                                                </div>
                                                <div>
                                                    [wpm: {result.wpm.toFixed(2)}]
                                                </div>
                                                <div>
                                                    [accuracy: {result.accuracy}%]
                                                </div>
                                                <div>
                                                    [time: {result.time} s.]
                                                </div>
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
                                        fontSize="30px"
                                        focusOnStart={true}
                                    />
                                :
                                <div className="text-5xl text-white font-extrabold m-auto">
                                    Ожидание игроков
                                </div>
                            :
                            <div className="text-5xl text-red-500 font-extrabold m-auto">
                                Не удалось начать игру
                            </div>
                        }

                    </div>
                </div>
                <div className="h-full p-10 pb-24">
                    <div className="bg-white/10 backdrop:blur-sm rounded-2xl p-4 h-full">
                        <div className=" h-full">
                            {
                                waitTill && !isStarted ?
                                    <WaitTimer wontStart={gameWontStart} waitTill={waitTill} />
                                    :
                                    null
                            }
                            {
                                players.map((player) => (
                                    <Player player={player} key={player.id} />
                                ))
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}