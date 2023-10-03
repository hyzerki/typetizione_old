import React from "react";
import { useRecoilValue } from "recoil";
import { fetchPlayerDataSelector } from "../../selectors/fetchPlayerdataSelector";
import { Link } from "react-router-dom";
import { currentPlayerState } from "../../state/currentPlayerState";


function CurrentPlayerInfo() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const currentPlayerData = useRecoilValue(fetchPlayerDataSelector);
    if (!!currentPlayer) {
        return (
            <React.Fragment>
                <Link to={"/player/" + currentPlayerData?.id}>
                    <div className=" mb-2 font-semibold text-4xl">{currentPlayerData?.username}</div>
                </Link>
                <div className="mb-2 text-3xl">{currentPlayerData?.rating}</div>
            </React.Fragment>
        )
    } else {
        return (
            <div className="flex flex-col  items-center">
                <div className=" text-2xl">
                    Профиль недоступен
                </div>
                <div className="p-5">
                    <Link className="btn-green" to={"/auth/login"}>Войти</Link>
                </div>
            </div>
        );
    }
}

export default CurrentPlayerInfo;