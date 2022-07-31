import React, { useState } from "react";
import DialogMessage from "./DialogMessage";

const ChatIcon = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        className="cursor-pointer flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10"
        onClick={() => setOpen(true)}
      >
        <div>
          <div
            title="Chat"
            className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
          >
            <img
              className="object-cover object-center w-full h-full rounded-full"
              src="https://harver.com/wp-content/uploads/2020/08/chat@2x.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <DialogMessage open={open} setOpen={setOpen} />
    </div>
  );
};

export default ChatIcon;
