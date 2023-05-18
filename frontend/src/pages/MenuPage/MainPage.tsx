import { Link } from "react-router-dom";
import ChatComponent from "../../components/ChatComponent";
import TypeForm from "../../components/TypeForm/TypeForm";
import { useRecoilValue } from "recoil";
import { fetchPlayerDataSelector } from "../../selectors/fetchPlayerdataSelector";
import React, { Suspense } from "react";
import CurrentPlayerInfo from "./CurrentPlayerInfo";
import Friendlist from "./FriendList/Friendlist";

function MainPage() {




    return (

        <div className="h-full bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">
                    <div className=" bg-neutral-700 h-full mb-10 flex flex-col">
                        <div className="h-40 border">
                            <React.Suspense fallback={<div>Loading..</div>}>
                                <CurrentPlayerInfo />
                            </React.Suspense>
                        </div>
                        <div className="h-full flex flex-col">
                            <div className="text-2xl h-8 bg-neutral-800 text-white">
                                Friends:
                            </div>
                            <div className="shrink-0 h-[0] grow-[20] overflow-auto">
                                    <Suspense fallback={<div>Loading..</div>}>
                                        <Friendlist />
                                    </Suspense>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-span-2 bg-neutral-800 flex flex-col">
                    <div className="h-3/5">
                        <TypeForm fontSize="30px" />
                    </div>
                    <div className="h-2/5 min-h-[40%] px-10 py-20">
                        <ChatComponent />
                    </div>
                </div>
                <div className="h-full p-10 pb-24">
                    <div className=" bg-neutral-700 h-full mb-10 flex flex-col">
                        <div className="bg-neutral-800">
                            <div className="font text-2xl text-white">Recent matches:</div>
                        </div>
                        <div className="h-full">
                            <div className="bg-green-700/50  text-lg overflow-clip flex gap-x-2 flex-row">
                                <div>01.01.1970</div>
                                <div>1st</div>
                                <div>Competetive</div>
                                <div>Russian</div>
                                <div>1594(+31)</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>
    )
}

export default MainPage;