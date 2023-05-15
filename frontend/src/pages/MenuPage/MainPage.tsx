import { Link } from "react-router-dom";
import ChatComponent from "../../components/ChatComponent";
import TypeForm from "../../components/TypeForm/TypeForm";

function MainPage() {


    return (

            <div className="h-full bg-neutral-800">
                <div className="grid h-full grid-cols-4">
                    <div className="h-full p-10 pb-24">
                        <div className=" bg-neutral-700 h-full mb-10 flex flex-col">
                            <div className="h-40 border">
                                
                                <div className="font mb-2 text-3xl">Профиль недоступен</div>

                                <Link className="btn-green" to={"/login"}>Войти</Link>
                            </div>
                            <div className="h-full">
                                <div className="text-2xl bg-neutral-800 text-white">
                                    Friends:
                                </div>
                                <div className="border h-24">

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