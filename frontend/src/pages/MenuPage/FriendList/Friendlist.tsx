import { useRecoilValue } from "recoil";
import { currentPlayerState } from "../../../state/currentPlayerState";
import { friendlistSelector } from "../../../selectors/friendlistSelector";
import { Fragment } from "react";



function Friendlist() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const friendListData = useRecoilValue(friendlistSelector);

    //todo стейт для инпута кода друга, а так же функция отправки запроса 


    function Friend(props: any) {
        //todo удаление из друзей
        return (
            <div className="flex">
                <div className="w-full">
                    {props.player.username}
                </div>
                <div className="flex gap-2">
                    <div className="border px-1">
                        <input value="пригласить" type="button"  />
                    </div>
                    <div className="border w-6 px-2">
                        <input value="X" type="button" />
                    </div>
                </div>
            </div>
        )
    }

    function IncomingRequest(props: any) {
        //todo отклонение запроса
        //todo принятие запроса
        return (
            <div className="flex">
                <div className="w-full">
                    {props.player.username}
                </div>
                <div className="flex gap-2">
                    <div className="border w-6 px-1">
                        <input value="+" type="button" />
                    </div>
                    <div className="border w-6 px-2">
                        <input value="X" type="button" />
                    </div>
                </div>
            </div>
        )
    }


    function OutgoingRequest(props: any) {
        //todo отмена исходящего запроса
        return (
            <div className="flex">
                <div className="w-full">
                    {props.player.username}
                </div>
                <div className="">
                    <div className="border w-6 px-2">
                        <input value="X" type="button" />
                    </div>

                </div>
            </div>
        )
    }


    if (!!!currentPlayer) {
        return (
            <div className="text-3xl text-white ml-4">
                Войдите, чтобы получить доступ к списку друзей
            </div>
        )
    }

    function getFriends() {
        let initiated = friendListData.initiated_relations.filter((relation: any) => relation.is_accepted);
        let proposed = friendListData.proposed_relations.filter((relation: any) => relation.is_accepted);
        initiated = initiated.map((rel: any) => rel.related_player_two);
        proposed = proposed.map((rel: any) => rel.related_player_one);
        return [...initiated, ...proposed];
    }

    const outgoingRequests = friendListData.initiated_relations.filter((relation: any) => !relation.is_accepted);
    const incomingRequests = friendListData.proposed_relations.filter((relation: any) => !relation.is_accepted);
    const friends = getFriends();



    return (
        <Fragment>
            <div className="bg-neutral-600 text-white flex">
                <div className="grow">
                    Добавить друга <input className="bg-neutral-400 w-20" type="number" />
                    <input type="button" value="Отправить" className="bg-neutral-600 border border-neutral-900 text-white" />

                </div>
                <div>
                    {"Ваш код: " + currentPlayer.id}
                </div>
            </div>

            <div>
                {incomingRequests.length !== 0 ?
                    <Fragment>
                        <div>Запросы на добавление в друзья:</div>
                        {
                            incomingRequests.map((relation: any) => (
                                <IncomingRequest player={relation.related_player_one} />
                            ))
                        }
                        <hr />  
                    </Fragment>
                    : null
                }
            </div>

            <div>
                <div>Друзья</div>
                {friends.map((friend: any) => (
                    <Friend player={friend}/>
                ))}
            </div>

            <div>
                {outgoingRequests.length !== 0 ?
                    <Fragment>
                        <hr />
                        <div>Исходящие запросы:</div>
                        {
                            outgoingRequests.map((relation: any) => (
                                <OutgoingRequest player={relation.related_player_two} />
                            ))}
                    </Fragment>
                    : null
                }
            </div>
        </Fragment>

    )
}

export default Friendlist;