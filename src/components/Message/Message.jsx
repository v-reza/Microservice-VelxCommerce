import React from "react";
import * as timago from "timeago.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Message = ({ message, isSender, receiveProfile }) => {
  return (
    <div>
      <li
        className={classNames(
          isSender ? "flex justify-end" : "flex justify-start",
          "flex"
        )}
      >
        <div
          className={classNames(
            isSender ? "bg-gray-100" : "",
            "relative max-w-xl px-4 py-2 text-gray-700 rounded"
          )}
        >
          <span className="block">{message.text}</span>
          <small className="mt-1 block text-gray-400">{timago.format(message.createdAt)}</small>
        </div>
      </li>
    </div>
  );
};

export default Message;
