import { Avatar } from "@mui/material";
import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/UserContext";
import { axiosPost } from "../../helper/axiosHelper";
import Message from "./Message";

const MessageBox = ({
  setOpenMessage,
  messages,
  receiveProfile,
  newMessage,
  setNewMessage,
  currentChat,
  socket,
  setMessages,
}) => {
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();
  console.log(messages)
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const sellerId = currentChat.members.find(
      (sellerId) => sellerId !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: sellerId,
      text: newMessage,
    });

    try {
      const res = await axiosPost("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
      
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <div className="lg:col-span-2 lg:block">
        <div className="w-full">
          <div className="relative flex justify-center items-center p-3 border-b border-gray-300">
            <svg
              onClick={() => setOpenMessage(false)}
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer flex items-center justify-start fixed top-6 left-7 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <Avatar className="object-cover w-10 h-10 rounded-full">
              {receiveProfile?.name ? receiveProfile.name[0].toUpperCase() : ""}
            </Avatar>
            <span className="block ml-2 font-bold text-gray-600">
              {receiveProfile?.name}
            </span>
            {/* <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span> */}
          </div>
          <div
            className="relative w-full p-6 overflow-y-scroll scroll-smooth h-[19rem]"
            id="chat-scroll"
          >
            <ul className="space-y-2">
              {messages.map((message) => (
                <div key={message._id} ref={scrollRef}>
                  <Message
                    message={message}
                    isSender={message.sender === user._id}
                    receiveProfile={
                      message.sender !== user._id ? receiveProfile : user._id
                    }
                  />
                </div>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Message"
              className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>
            <button onClick={handleSubmit} type="button">
              <svg
                className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
