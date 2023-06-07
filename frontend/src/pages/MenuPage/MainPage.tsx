import { Link } from "react-router-dom";
import ChatComponent from "../../components/ChatComponent";
import TypeForm from "../../components/TypeForm/TypeForm";
import { useRecoilValue } from "recoil";
import { fetchPlayerDataSelector } from "../../selectors/fetchPlayerdataSelector";
import React, { Fragment, Suspense } from "react";
import CurrentPlayerInfo from "./CurrentPlayerInfo";
import Friendlist from "./FriendList/Friendlist";

function MainPage() {




    return (

        <div className="h-full bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">
                    <div className="  h-full mb-10 flex flex-col">
                        <div className="h-40 bg-white/10 backdrop-blur-sm  rounded-xl ">
                            <React.Suspense fallback={
                                <Fragment>
                                    <div className="h-6 bg-neutral-700 w-24 mx-1 mt-2 mb-5 "></div>
                                    <div className="h-6 bg-neutral-700 w-16 mx-1 mt-2 mb-2 "></div>
                                </Fragment>
                            }>
                                <CurrentPlayerInfo />
                            </React.Suspense>
                        </div>
                        <div className="h-full flex flex-col">
                            <div className="text-2xl h-8 bg-neutral-800 text-white">
                                Friends:
                            </div>
                            <div className="shrink-0 h-[0] grow-[20] bg-neutral-700 overflow-auto">
                                <Suspense fallback={<div>Loading..</div>}>
                                    <Friendlist />
                                </Suspense>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-span-2 bg-neutral-800 flex flex-col">
                    <div className="h-3/5">
                        <TypeForm 
                        textToType="Алиса уже почти догнала его, вслед за ним повернув за угол, но Кролика больше не было видно: она находилась в длинном низком зале, освещенном рядом ламп, свисающих с потолка. По обе стороны зала всюду были двери, но все запертые. Алиса обошла обе стены, пробуя каждую дверь, и затем печально вернулась на середину зала, спрашивая себя, каким путем и когда она выйдет отсюда. Вдруг Алиса очутилась перед маленьким трехногим столом, целиком сделанным из толстого стекла. На столе не было ничего, кроме крошечного золотого ключика."
                        fontSize="30px" />
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