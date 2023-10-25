import { selector, useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from "recoil";
import { currentPlayerState } from "../../../state/currentPlayerState";
import { friendlistSelector } from "../../../selectors/friendlistSelector";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import FriendsService from "../../../service/friendsService";
import { partyInvitesState } from "../../../state/partyInvitesState";
import { websocketState } from "../../../state/websocketState";
import playerService from "../../../service/playerService";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, PlusCircleIcon, PlusIcon, UserMinusIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Link } from "react-router-dom";




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

    function handleInvalidateFriendList() {
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

            <div className="flex py-2 group">
                {isLoading && !invitor ?
                    <div className="w-full">
                        Загрузка..
                    </div>
                    :
                    <Fragment>
                        <div className="w-full">
                            <Link to={"/player/" + invitor.id}>
                                {invitor.username}
                            </Link>
                        </div>
                        <div className="flex gap-2 invisible group-hover:visible">
                            <div className="border glass rounded-sm h-[1.65em] w-[1.65em]">
                                <button onClick={joinLobby}><PlusCircleIcon className="h-full w-full" /></button>
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
            <div className="flex py-2 group">
                <div className="w-full">
                    <Link to={"/player/" + props.player.id}>
                        {props.player.username}
                    </Link>
                </div>
                <div className="flex gap-2 invisible group-hover:visible">
                    <div className="border glass rounded-sm h-[1.65em] w-[1.65em]">
                        <button onClick={() => { socket.emit("invite", props.player.id) }}><PlusCircleIcon className="h-full w-full" /></button>
                    </div>
                    <div className="border glass h-[1.65em] w-[1.65em] rounded-sm ">
                        <button onClick={deleteFriend}><UserMinusIcon className="h-full w-full" /></button>
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
            <div id={props.id} className="flex py-2 group">
                <div className="w-full">
                    <Link to={"/player/" + props.player.id}>
                        {props.player.username}
                    </Link>
                </div>
                <div className="flex gap-2 invisible group-hover:visible">
                    <div className="border glass rounded-sm w-[1.65em] h-[1.65em]">
                        <button onClick={acceptFriendRequest}><UserPlusIcon className="h-full w-full" /></button>

                    </div>
                    <div className="border glass rounded-sm w-[1.65em] h-[1.65em]">
                        <button onClick={declineRequest}><XMarkIcon className="h-full w-full" /></button>

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
            <div className="flex py-2 group">
                <div className="w-full">
                    <Link to={"/player/" + props.player.id}>
                        {props.player.username}
                    </Link>
                </div>
                <div className="invisible group-hover:visible">
                    <div className="border glass rounded-sm w-[1.65em] h-[1.65em]">
                        <button onClick={cancellRequest}><XMarkIcon className="h-full w-full" /></button>
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
            <div>
                {invites.length !== 0 ?
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="p-2 glass w-full flex justify-between">
                                    <span>Приглашения в группу</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''
                                            } h-5 w-5`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-white px-2">
                                    {
                                        invites.map((invite: any) => (
                                            <Invite key={invite} invite={invite} />
                                        ))
                                    }
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    : null
                }
            </div>

            <div>
                {incomingRequests.length !== 0 ?
                    <Disclosure defaultOpen={true}>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="p-2 glass w-full flex justify-between">
                                    <span>Запросы на добавление в друзья</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''
                                            } h-5 w-5`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-white px-2">
                                    {
                                        incomingRequests.map((relation: any) => (
                                            <IncomingRequest key={relation.related_player_one.id} player={relation.related_player_one} />
                                        ))
                                    }
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    : null
                }
            </div>
            <div>
                <Disclosure defaultOpen={true}>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="p-2 glass w-full flex justify-between">
                                <span>Друзья</span>
                                <ChevronUpIcon
                                    className={`${open ? 'rotate-180 transform' : ''
                                        } h-5 w-5`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-white px-2">
                                {friends.map((friend: any,) => (
                                    <Friend key={friend.id} player={friend} />
                                ))}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
            <div>
                {outgoingRequests.length !== 0 ?
                    <Disclosure >
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="p-2 glass w-full flex justify-between">
                                    <span>Исходящие запросы</span>
                                    <ChevronUpIcon
                                        className={`${open ? 'rotate-180 transform' : ''
                                            } h-5 w-5`}
                                    />
                                </Disclosure.Button>
                                <Disclosure.Panel className="text-white px-2">
                                    {
                                        outgoingRequests.map((relation: any, index: string) => (
                                            <OutgoingRequest key={relation.related_player_two.id} player={relation.related_player_two} />
                                        ))}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                    : null
                }
            </div>
        </Fragment>

    )
}

export default Friendlist;