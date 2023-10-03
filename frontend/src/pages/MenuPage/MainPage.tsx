import { Link } from "react-router-dom";
import ChatComponent from "../../components/ChatComponent";
import TypeForm from "../../components/TypeForm/TypeForm";
import { useRecoilValue } from "recoil";
import { fetchPlayerDataSelector } from "../../selectors/fetchPlayerdataSelector";
import React, { Fragment, Suspense, useEffect, useState } from "react";
import CurrentPlayerInfo from "./CurrentPlayerInfo";
import Friendlist from "./FriendList/Friendlist";
import TextService from "../../service/textService";
import { recentMatchesSelector } from "../../selectors/recentMatchesSelector";
import { currentPlayerState } from "../../state/currentPlayerState";
import TrainingForm from "../../components/TypeForm/TrainingForm";
import AddFriendModal from "../../components/AddFriendModal";

function MainPage() {

    const currentPlayer = useRecoilValue(currentPlayerState);



    function RecentMatchesList() {
        const recentMatches = useRecoilValue(recentMatchesSelector);

        return (
            <Fragment>
                {
                    recentMatches.map((match: any) => (
                        <div className={`${match.rating_gain > 0 ? "bg-green-700/50" : "bg-red-700/50"}  text-lg overflow-clip flex gap-x-2 flex-row`}>
                            <div>{new Date(match.game.date_time).toLocaleString()}</div>
                            <div>{match.accuracy}</div>
                            <div>{match.game.text_to_type.text_language}</div>
                            <div>{match.rating}({match.rating_gain})</div>
                        </div>
                    ))
                }
            </Fragment>
        )
    }

    return (
        <div className="h-full ">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">
                    <div className="  h-full mb-10 flex flex-col">
                        <div className="h-40 glass  text-white rounded-xl">
                            <div className="m-2">
                                <React.Suspense fallback={
                                    <Fragment>
                                        <div className="h-6 bg-neutral-700 w-24 mx-1 mt-2 mb-5 "></div>
                                        <div className="h-6 bg-neutral-700 w-16 mx-1 mt-2 mb-2 "></div>
                                    </Fragment>
                                }>
                                    <CurrentPlayerInfo />
                                </React.Suspense>
                            </div>
                        </div>
                        <div className="h-full flex flex-col">
                            <div className="text-2xl h-8 flex flex-row text-white">
                                <div className="grow">
                                    Friends:
                                </div>
                                <div className="grow flex justify-end">
                                    <AddFriendModal/>
                                </div>
                            </div>
                            <div className="shrink-0 h-[0] grow-[20] text-white glass rounded-xl overflow-auto">
                                <Suspense fallback={<div>Loading..</div>}>
                                    <Friendlist />
                                </Suspense>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-span-2  flex flex-col">
                    <div className="h-3/5 mt-10 backdrop-blur-xl bg-black/50 rounded-xl">
                        <TrainingForm />
                    </div>
                    <div className="h-2/5 min-h-[40%] px-10 py-20">
                        <ChatComponent />
                    </div>
                </div>
                <div className="h-full p-10 pb-24">
                    {!!currentPlayer ?
                        <div className=" h-full mb-10 flex flex-col">
                            <div className="">
                                <div className="font text-2xl text-white">Recent matches:</div>
                            </div>
                            <div className="h-full glass rounded-xl overflow-auto text-white">
                                <Suspense>
                                    <RecentMatchesList />
                                </Suspense>
                            </div>

                        </div>
                        : null
                    }
                </div>
            </div>


        </div>
    )
}

export default MainPage;