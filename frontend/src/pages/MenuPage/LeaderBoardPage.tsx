import { Link, useNavigate, useParams } from "react-router-dom";
import TypeForm from "../../components/TypeForm/TypeForm";
import { Socket, io } from "socket.io-client";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayerState } from "../../state/currentPlayerState";
import PlayerService from "../../service/playerService";
import Player from "../../model/player";
import useInterval from "../../hooks/useInterval";

export default function LeaderBoardPage() {
    const [rating, setRating] = useState<any[]>([]);
    const [cpm, setCpm] = useState<any[]>([]);

    useEffect(() => {
        PlayerService.getCpmLeaderBoard().then(lb => { setCpm(lb) });
        PlayerService.getRatingLeaderBoard().then(lb => { setRating(lb) });
    }, [])

    return (
        <div className="h-screen bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">

                </div>
                <div className="col-span-1  bg-neutral-800">
                    <div className="h-full flex flex-col">
                        <div className="shrink-0 h-[0] grow-[20] m-4 text-white bg-neutral-700 overflow-auto text-2xl">
                            {rating.map((entry, index) => (

                                <div className="" key={index}>
                                    <Link to={`/player/${entry.id}`}>
                                        <div className="flex gap-2">
                                            <div>{index + 1}</div>
                                            <div>{entry.username}</div>
                                            <div>Рейтинг: {entry.rating}</div>

                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-1  bg-neutral-800">
                    <div className="h-full flex flex-col">
                        <div className="shrink-0 h-[0] grow-[20] m-4 text-white bg-neutral-700 overflow-auto text-2xl">
                            {cpm.map((entry, index) => (
                                <div className="" key={index}>
                                <Link to={`/player/${entry.player.id}`}>
                                    <div className="flex gap-2">
                                    <div>{index + 1}</div>
                                    <div>{entry.player.username}</div>
                                    <div>cpm: {entry.cpm}</div>
                                    </div>
                                </Link>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="h-full p-10 pb-24">
                    
                </div>
            </div>
        </div>
    );
}