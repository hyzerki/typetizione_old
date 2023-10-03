import { Fragment, useRef, useState } from 'react'
import { Dialog, FocusTrap, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import { currentPlayerState } from '../state/currentPlayerState';
import FriendsService from '../service/friendsService';
import { friendlistSelector } from '../selectors/friendlistSelector';
import PulseLoader from './loaders/PulseLoader';
import { AxiosError } from 'axios';

function AddFriendModal(props: any) {
    const currentPlayer = useRecoilValue(currentPlayerState);
    const friendListRefresh = useRecoilRefresher_UNSTABLE(friendlistSelector);
    const [isRequestLoading, setIsReqestLoading] = useState<boolean>(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    //todo доделать отправку запроса, и вывод строки с ошибкой

    let [isOpen, setIsOpen] = useState(false)

    const friendCodeInputRef = useRef<HTMLInputElement>(null);
    async function sendFriendRequest() {
        if (!!friendCodeInputRef.current) {
            setIsReqestLoading(true);
            try {
                await FriendsService.createFriendRequest(parseInt(friendCodeInputRef.current.value) as number);
                setResultMessage("Request sent!")
                friendListRefresh();
            } catch (e) {
                if (e instanceof AxiosError) {
                    if (e.status === 404) {
                        setResultMessage("User not found.");
                    }
                    else {
                        setResultMessage("Error occured. Check developer console for further information.")
                    }
                }
                console.log(e);
            }
            friendCodeInputRef.current.value = "";
            setIsReqestLoading(false);
        } else {
            console.error("codeInputRef is null or not defined")
        }
    }

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div className=" flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="h-[1.65em] w-[1.65em]"
                >
                    <PlusIcon />
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10 text-white" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl glass p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        Add friend
                                    </Dialog.Title>
                                    <div className="mt-2 flex-col flex">
                                        <div className='self-center text-xl'>Your code: {currentPlayer?.id}</div>
                                        <div className="self-center mt-2">
                                            <FocusTrap>
                                                <input type='text' ref={friendCodeInputRef} placeholder='Enter code or username' className='glass text-2xl focus:outline-none' />
                                            </FocusTrap>
                                        </div>
                                        {
                                            resultMessage ?
                                                <div>{resultMessage}</div> : null
                                        }

                                    </div>

                                    <div className="mt-4 flex flex-row justify-evenly">
                                        <div className='h-[1.65em]'>
                                            {
                                                isRequestLoading ?
                                                    <PulseLoader /> :
                                                    <button
                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={sendFriendRequest}
                                                    >
                                                        Send request
                                                    </button>
                                            }
                                        </div>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default AddFriendModal;