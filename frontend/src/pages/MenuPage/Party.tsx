import { useLayoutEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { websocketState } from "../../state/websocketState";
import { lobbyState } from "../../state/lobbyState";
import { currentPlayerState } from "../../state/currentPlayerState";
import { Popover } from "@headlessui/react";
import { Link } from "react-router-dom";

function Party() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const socket = useRecoilValue(websocketState);
    const [lobby, setLobby] = useRecoilState(lobbyState);

    function handlePartyChange(payload: any) {
        setLobby(payload);
    }

    useLayoutEffect(() => {
        socket.on("lobby_changed", handlePartyChange)
        return () => {
            socket.removeListener("lobby_changed", handlePartyChange);
        }
    }, [socket])

    function PartyMember(props: any) {
        const player = props.player;

        function leaveLobby() {
            socket.emit("leave_lobby");
        }


        return (
            <Popover className="relative z-50 border-white border-1">
                <Popover.Button className="focus:outline-none">
                    <div className={` h-[60px] w-[60px] text-6xl align-middle ${currentPlayer?.id == player.player_id ? "text-sky-500 border-sky-500 border-4" : ""} bg-neutral-200`}>
                        {
                            player.username[0]
                        }
                    </div>
                </Popover.Button>
                <Popover.Panel className="absolute min-w-max bottom-[70px] p-2 backdrop-blur-sm bg-white/10  text-neutral-100 rounded-lg">
                    <div className="font-bold glass rounded-md">
                        {player.username}
                    </div>
                    <div>
                        <Link to={"/player/" + player.player_id}>
                            <div>
                                Открыть профиль
                            </div>
                        </Link>
                    </div>
                    <hr />
                    <div>
                        <input type="button" onClick={leaveLobby} value="Покинуть группу" />
                    </div>
                </Popover.Panel>
            </Popover>
        )
    }

    // function PartyMember(props: any) {
    //     const player = props.player;
    //     return (
    //         <div className={`h-[60px] w-[60px] text-6xl align-middle ${currentPlayer?.id == player.player_id? "text-sky-500 border-sky-500 border-4" : ""} bg-neutral-200`}>
    //             {
    //                 player.username[0]
    //             }
    //         </div>
    //     )
    // }


    return (
        <div className=" flex flex-row gap-x-2 ">
            {
                lobby.players.map((player: any, index: number) => (
                    <PartyMember key={index} slot={index} player={player} />
                ))
            }
        </div>
    )
}

export default Party;