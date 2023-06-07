import { Link, resolvePath, useNavigate, useParams } from "react-router-dom";
import ChatComponent from "../../components/ChatComponent";
import TypeForm from "../../components/TypeForm/TypeForm";
import { useRecoilValue } from "recoil";
import { fetchPlayerDataSelector } from "../../selectors/fetchPlayerdataSelector";
import React, { Fragment, Suspense, useLayoutEffect, useState } from "react";
import CurrentPlayerInfo from "./CurrentPlayerInfo";
import Friendlist from "./FriendList/Friendlist";
import playerService from "../../service/playerService";
import { currentPlayerState } from "../../state/currentPlayerState";
import { Axios, AxiosError } from "axios";

function PlayerPage() {

    const [player, setPlayer] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);
    const currentPlayer = useRecoilValue(currentPlayerState);
    const [usernameChanged, setUsernameChanged] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!params.id) {
            navigate("/");
        }
        setLoading(true);
        playerService.getPlayerById(parseInt(params.id!)).then(data => {
            console.log("invitor: ", data);
            setPlayer(data);
            setLoading(false);
        });
    }, []);

    function handleUsernameInput(e: any) {
        setUsername(e.target.value);
        setUsernameChanged(true);
    }

    async function switchToEditMode() {
        if (!editMode) {
            setUsername(player.username);
        }
        setEditMode(!editMode);
        if (!usernameChanged) { return; }
        setUsernameChanged(false);
        if (username === player.username) { return; }
        try {
            await playerService.updatePlayer(username);
            setPlayer((oldPlayer: any) => { return { ...oldPlayer, username } });
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error);
            }
            return;
        }
    }

    //todo вывод истории матчей, и статистики
    return (

        <div className="h-full bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">
                    <div className="  h-full mb-10 flex flex-col">
                        <div className="h-40 bg-white/10 backdrop-blur-sm  rounded-xl ">
                            {
                                isLoading ?
                                    <Fragment>
                                        <div className="h-6 bg-neutral-700 w-24 mx-1 mt-2 mb-5 "></div>
                                        <div className="h-6 bg-neutral-700 w-16 mx-1 mt-2 mb-2 "></div>
                                    </Fragment>
                                    :
                                    player ?
                                        <Fragment>
                                            {editMode ?
                                                <div className="overflow-clip rounded-xl" >
                                                    <input type="text" onInput={handleUsernameInput} value={username} className=" text-4xl bg-white/10 backdrop:blur-sm outline-none rounded-xl mb-2 font-semibold " />
                                                </div>
                                                :
                                                <div contentEditable={editMode} className=" mb-2 font-semibold text-4xl">{player.username}</div>
                                            }
                                            <div className="mb-2 text-3xl">{player.rating}</div>
                                            {currentPlayer?.id === player.id ?
                                                <input onClick={switchToEditMode} type="button" value={editMode ? "Сохранить" : "Редактировать"} className="font-semibold border-green-800 border w-fit p-1 text-green-600 ml-2 rounded-md" />
                                                :
                                                null}
                                        </Fragment>
                                        :
                                        null
                            }
                        </div>
                        <div className="h-full flex flex-col">
                            <div className="text-2xl h-8 bg-neutral-800 text-white">
                                Статистика:
                            </div>
                            <div className="shrink-0 h-[0] grow-[20] bg-neutral-700 overflow-auto">

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 bg-neutral-800 flex flex-col">

                    {
                        isLoading ?
                            null
                            :
                            player ?
                                <div>
                                    история матчей
                                </div>
                                :
                                <div className="text-5xl text-white font-extrabold underline underline-offset-8  m-auto">
                                    <span className="text-6xl text-red-600">404</span> Игрок не найден!
                                </div>
                    }
                </div>

            </div>


        </div>
    )
}

export default PlayerPage;