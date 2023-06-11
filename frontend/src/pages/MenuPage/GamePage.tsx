import { useParams } from "react-router-dom";
import TypeForm from "../../components/TypeForm/TypeForm";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentPlayerState } from "../../state/currentPlayerState";

export default function GamePage() {
    const params = useParams();
    const currentPlayer = useRecoilValue(currentPlayerState);
    const [socketError,setSocketError] = useState(false);

    const [gameSocket, setGameSocket] = useState(
        io(`${import.meta.env.VITE_API_BASE_URL}/playgame`,
            {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        }
                    }
                }
            })
    );

    useEffect(() => {
        gameSocket.on('disconnect', () => {
            if (gameSocket.disconnected && !!currentPlayer) {
                setSocketError(true);
                gameSocket.on('connect', () => {
                    setSocketError(false);
                })
            }
        });
    },[gameSocket])

    return (
        <div className="h-screen bg-neutral-800">
            <div className="grid h-full grid-cols-4">
                <div className="h-full p-10 pb-24">

                </div>
                <div className="col-span-2 bg-neutral-800">
                    <div className="h-3/5">
                        <TypeForm
                            textToType="Алиса уже почти догнала его, вслед за ним повернув за угол, но Кролика больше не было видно: она находилась в длинном низком зале, освещенном рядом ламп, свисающих с потолка. По обе стороны зала всюду были двери, но все запертые. Алиса обошла обе стены, пробуя каждую дверь, и затем печально вернулась на середину зала, спрашивая себя, каким путем и когда она выйдет отсюда. Вдруг Алиса очутилась перед маленьким трехногим столом, целиком сделанным из толстого стекла. На столе не было ничего, кроме крошечного золотого ключика."
                            fontSize="30px" />
                        <div className="h-2/5 min-h-[40%] px-10 py-20">

                        </div>
                    </div>
                </div>
                <div className="h-full p-10 pb-24">

                </div>
            </div>
        </div>
    );
}