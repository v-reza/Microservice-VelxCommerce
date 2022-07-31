import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { UsersIcon } from "@heroicons/react/outline";
import MessageBox from "./MessageBox";
import { axiosGet } from "../../helper/axiosHelper";
import { AuthContext } from "../../context/UserContext";
import Conversations from "./Conversations";
import { Avatar } from "@mui/material";
import { io } from "socket.io-client";
import { useSocket } from "../../helper/useSocket";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DialogMessage({ open, setOpen }) {
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const { user, token } = useContext(AuthContext);
  const [conversationsUser, setConversationsUser] = useState([]);
  const [openSendMessage, setOpenSendMessage] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [receiveProfile, setReceiveProfile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const filteredPeople =
    query === ""
      ? []
      : conversationsUser.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  //socket
  const socket = useRef();
  const urlSocket = useSocket();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  useEffect(() => {
    socket.current = io(urlSocket, {transports: ['websocket']});
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prevVal) => [...prevVal, arrivalMessage]);
  }, [arrivalMessage, currentChat?.members]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
  }, [user._id]);

  // get conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axiosGet(`/conversations/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConversations(res.data);
      } catch (error) {}
    };
    getConversations();
  }, [token, user._id]);

  //get conversations user
  useEffect(() => {
    const getConversationsUser = () => {
      const resultFilter = [];
      // eslint-disable-next-line array-callback-return
      conversations?.filter((conversation) => {
        resultFilter.push(
          conversation.members.find((sellerId) => sellerId !== user._id)
        );
      });
      resultFilter.map(async (sellerId) => {
        try {
          const res = await axiosGet(`/users/${sellerId}`);
          setConversationsUser((prevState) => [
            ...prevState.filter((value) => {
              return value._id !== sellerId;
            }),
            res.data,
          ]);
        } catch (error) {
          console.log(error);
        }
      });
    };
    getConversationsUser();
  }, [conversations, user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axiosGet(`/messages/${currentChat?._id}`);
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat?._id]);

  const handleSendMessage = async (currentChat) => {
    setReceiveProfile(currentChat);
    const res = await axiosGet(`/conversations/find/${currentChat?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCurrentChat(res.data);
    setOpenSendMessage(true);
  };
  useEffect(() => {
    if (openSendMessage) {
      setQuery("");
      setConversationsUser(conversationsUser);
    } else {
      setMessages(messages);
    }
  }, [conversationsUser, messages, openSendMessage, query]);

  //end socket
  // console.log(currentChat)

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery("")}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20"
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            as="div"
            className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
            onChange={(conversationsUser) =>
              handleSendMessage(conversationsUser)
            }
          >
            {openSendMessage ? (
              <MessageBox
                setOpenMessage={setOpenSendMessage}
                messages={messages}
                receiveProfile={receiveProfile}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                currentChat={currentChat}
                socket={socket}
                setMessages={setMessages}
              />
            ) : (
              ({ activeOption }) => (
                <>
                  <div className="relative">
                    <SearchIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                      placeholder="Search..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  </div>

                  {(query === "" || conversationsUser.length > 0) && (
                    <div className="flex divide-x divide-gray-100">
                      <div
                        className={classNames(
                          "max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4",
                          activeOption && "sm:h-96"
                        )}
                      >
                        {query === "" && (
                          <h2 className="mt-2 mb-4 text-xs font-semibold text-gray-500">
                            Recent conversations
                          </h2>
                        )}
                        <Combobox.Options
                          static
                          hold
                          className="-mx-2 text-sm text-gray-700"
                        >
                          {(query === ""
                            ? conversationsUser
                            : filteredPeople
                          ).map((conversation, index) => (
                            <Combobox.Option
                              key={index}
                              value={conversation}
                              className={({ active }) =>
                                classNames(
                                  "flex cursor-default select-none items-center rounded-md p-2",
                                  active && "bg-gray-100 text-gray-900"
                                )
                              }
                            >
                              {({ active }) => (
                                <Conversations
                                  active={active}
                                  conversations={conversation}
                                  currentUser={user}
                                />
                              )}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      </div>

                      {activeOption && (
                        <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                          <div className="flex-none p-6 text-center">
                            <Avatar className="mx-auto h-16 w-16 rounded-full">
                              {activeOption.name
                                ? activeOption.name[0].toUpperCase()
                                : ""}
                            </Avatar>
                            <h2 className="mt-3 font-semibold text-gray-900">
                              {activeOption.name}
                            </h2>
                            <p className="text-sm leading-6 text-gray-500">
                              {activeOption.role}
                            </p>
                          </div>
                          <div className="flex flex-auto flex-col justify-between p-6">
                            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                              <dt className="col-end-1 font-semibold text-gray-900">
                                Phone
                              </dt>
                              <dd>
                                {activeOption.phone ? activeOption.phone : "-"}
                              </dd>
                              <dt className="col-end-1 font-semibold text-gray-900">
                                Store URL
                              </dt>
                              <dd className="truncate">
                                <a
                                  href={`/store/${activeOption.name}`}
                                  className="text-indigo-600 underline"
                                >
                                  {"https://velxcommerce.netlify.app/store/" +
                                    activeOption.name}
                                </a>
                              </dd>
                              <dt className="col-end-1 font-semibold text-gray-900">
                                Email
                              </dt>
                              <dd className="truncate">
                                <a
                                  href={`mailto:${activeOption.email}`}
                                  className="text-indigo-600 underline"
                                >
                                  {activeOption.email}
                                </a>
                              </dd>
                            </dl>
                            <button
                              type="button"
                              onClick={() => handleSendMessage(activeOption)}
                              className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Send message
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {query !== "" && filteredPeople.length === 0 && (
                    <div className="py-14 px-6 text-center text-sm sm:px-14">
                      <UsersIcon
                        className="mx-auto h-6 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mt-4 font-semibold text-gray-900">
                        No people found
                      </p>
                      <p className="mt-2 text-gray-500">
                        We couldn’t find anything with that term. Please try
                        again.
                      </p>
                    </div>
                  )}
                  {/* <Message /> */}
                </>
              )
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
