import { selector, useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from "recoil";
import { currentPlayerState } from "../../../state/currentPlayerState";
import { friendlistSelector } from "../../../selectors/friendlistSelector";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import FriendsService from "../../../service/friendsService";
import { partyInvitesState } from "../../../state/partyInvitesState";
import { websocketState } from "../../../state/websocketState";
import playerService from "../../../service/playerService";



function Friendlist() {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const friendListData = useRecoilValue(friendlistSelector);
    const friendListRefresh = useRecoilRefresher_UNSTABLE(friendlistSelector);
    const socket = useRecoilValue(websocketState);
    const [invites, setInvites] = useRecoilState(partyInvitesState);


    function handleInvite(payload: any) {
        setInvites(oldInvitesState => {
            //таким образом избавляемся от повторяющийхся инвайтов, и те, что приходят будут в начале списка
            const filteredInvites = oldInvitesState.filter(inviteEntry => inviteEntry !== payload);
            return [payload, ...filteredInvites];
        });
    }

    function handleInvalidateFriendList(){
        friendListRefresh();
    }

    useLayoutEffect(() => {
        socket.on("invite", handleInvite);
        socket.on("invalidate_friendlist", handleInvalidateFriendList);

        return () => {
            socket.removeListener("invite", handleInvite);
            socket.removeListener("invalidate_friendlist", handleInvalidateFriendList);
        }
    }, [socket])


    const friendCodeInputRef = useRef<HTMLInputElement>(null);
    async function sendFriendRequest() {
        if (!!friendCodeInputRef.current) {
            await FriendsService.createFriendRequest(parseInt(friendCodeInputRef.current.value) as number);
            friendListRefresh();
        }
    }

    function Invite(props: any) {
        //fix доделать 
        //блядь ну что я за еблан что тут доделать то надо сука

        const [invitor, setInvitor] = useState<any>(null);
        const [isLoading, setLoading] = useState(true);
        useLayoutEffect(() => {
            setLoading(true);
            playerService.getPlayerById(props.invite).then(data => {
                console.log("invitor: ", data);
                setInvitor(data);
                setLoading(false);
            });
        }, []);



        function joinLobby() {
            socket.emit("join_lobby", invitor.id);
            setInvites(oldInvitesState => {
                //таким образом избавляемся от повторяющийхся инвайтов, и те, что приходят будут в начале списка
                const filteredInvites = oldInvitesState.filter(inviteEntry => inviteEntry !== props.invite);
                return filteredInvites;
            });
        }

        return (

            <div className="flex">
                {isLoading && !invitor ?
                    <div className="w-full">
                        Загрузка..
                    </div>
                    :
                    <Fragment>
                        <div className="w-full">
                            {invitor.username}
                        </div>
                        <div className="flex gap-2">
                            <div className="border  px-2">
                                <input value="Присоединиться" onClick={joinLobby} type="button" />
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        );
    }

    function Friend(props: any) {
        async function deleteFriend() {
            await FriendsService.deleteFriendOrRequest(parseInt(props.player.id));
            friendListRefresh();
        }

        return (
            <div className="flex">
                <div className="w-full">
                    {props.player.username}
                </div>
                <div className="flex gap-2">
                    <div className="border px-1">
                        <input value="Пригласить" onClick={()=>{socket.emit("invite", props.player.id)}} type="button" />
                    </div>
                    <div className="border w-6 px-2">
                        <input value="X" onClick={deleteFriend} type="button" />
                    </div>
                </div>
            </div>
        )
    }

    function IncomingRequest(props: any) {

        async function declineRequest() {
            await FriendsService.deleteFriendOrRequest(parseInt(props.player.id));
            friendListRefresh();
        }
        async function acceptFriendRequest() {
            await FriendsService.acceptFriendRequest(parseInt(props.player.id));
            friendListRefresh();
        }
        return (
            <div id={props.id} className="flex">
                <div className="w-full">
                    {props.player.username}
                </div>
                <div className="flex gap-2">
                    <div className="border w-6 px-1">
                        <input onClick={acceptFriendRequest} value="+" type="button" />
                    </div>
                    <div className="border w-6 px-2">
                        <input value="X" onClick={declineRequest} type="button" />
                    </div>
                </div>
            </div>
        )
    }


    function OutgoingRequest(props: any) {
        async function cancellRequest() {
            await FriendsService.deleteFriendOrRequest(parseInt(props.player.id));
            friendListRefresh();
        }
        return (
            <div className="flex">
                <div className="w-full">
                    {props.player.username}
                </div>
                <div className="">
                    <div className="border w-6 px-2">
                        <input onClick={cancellRequest} value="X" type="button" />
                    </div>

                </div>
            </div>
        )
    }



    function getFriends() {
        let initiated = friendListData.initiated_relations.filter((relation: any) => relation.is_accepted);
        let proposed = friendListData.proposed_relations.filter((relation: any) => relation.is_accepted);
        initiated = initiated.map((rel: any) => rel.related_player_two);
        proposed = proposed.map((rel: any) => rel.related_player_one);
        let full = [...initiated, ...proposed];
        full.sort((a: any, b: any) => {
            if (a.username < b.username) {
                return -1;
            }
            if (a.username > b.username) {
                return 1;
            }
            return 0;
        })
        return full;
    }




    if (!!!currentPlayer) {
        return (
            <div className="text-3xl text-white ml-4">
                Войдите, чтобы получить доступ к списку друзей
            </div>
        )
    }


    const outgoingRequests = friendListData.initiated_relations.filter((relation: any) => !relation.is_accepted);
    const incomingRequests = friendListData.proposed_relations.filter((relation: any) => !relation.is_accepted);
    const friends = getFriends();


    return (
        <Fragment>
            <div className="bg-neutral-600 text-white flex">
                <div className="grow">
                    Добавить друга <input ref={friendCodeInputRef} className="bg-neutral-400 w-20" type="number" />
                    <input type="button" onClick={sendFriendRequest} value="Отправить" className="bg-neutral-600 border border-neutral-900 text-white" />
                </div>
                <div>
                    {"Ваш код: " + currentPlayer.id}
                </div>
            </div>

            <div>
                {invites.length !== 0 ?
                    <Fragment>
                        <div>Приглашения в группу:</div>
                        {
                            invites.map((invite: any) => (
                                <Invite key={invite} invite={invite} />
                            ))
                        }
                        <hr />
                    </Fragment>
                    : null
                }
            </div>

            <div>
                {incomingRequests.length !== 0 ?
                    <Fragment>
                        <div>Запросы на добавление в друзья:</div>
                        {
                            incomingRequests.map((relation: any) => (
                                <IncomingRequest key={relation.related_player_one.id} player={relation.related_player_one} />
                            ))
                        }
                        <hr />
                    </Fragment>
                    : null
                }
            </div>

            <div>
                <div>Друзья</div>
                {friends.map((friend: any,) => (
                    <Friend key={friend.id} player={friend} />
                ))}
            </div>

            <div>
                {outgoingRequests.length !== 0 ?
                    <Fragment>
                        <hr />
                        <div>Исходящие запросы:</div>
                        {
                            outgoingRequests.map((relation: any, index: string) => (
                                <OutgoingRequest key={relation.related_player_two.id} player={relation.related_player_two} />
                            ))}
                    </Fragment>
                    : null
                }
            </div>
        </Fragment>

    )
}

export default Friendlist;