import { ChevronRightIcon } from "@heroicons/react/outline";
import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";

const Conversations = ({ active, conversations, currentUser }) => {
  const [user, setUser] = useState(conversations);
  useEffect(() => {
    setUser(conversations);
  }, [conversations]);
  return (
    <>
      <Avatar className="h-6 w-6 flex-none rounded-full">
        {user.name ? user.name[0].toUpperCase() : ""}
      </Avatar>
      <span className="ml-3 flex-auto truncate">{user.name}</span>
      {active && (
        <ChevronRightIcon
          className="ml-3 h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Conversations;
