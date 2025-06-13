import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import formatMessageTime from "../lib/utils";

export default function ChatContainer() {
  const {
    selectedUser,
    getMessages,
    isMessagesLoading,
    messages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageContainerRef = useRef(null);

  useEffect(() => {
    // Get the messages of the selected user
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Scroll down to the latest message
  useEffect(() => {
    messageContainerRef.current.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      // behavior: "smooth",
    });
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-auto"
        ref={messageContainerRef}
      >
        {messages.map((message) => (
          <div
            id={message._id}
            key={message._id}
            className={`observe-div chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border-2  border-base-300">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  className="bg-base-300"
                  alt="Profile Pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div
              className={`max-w-[200px] ${
                message.image ? "p-0" : "chat-bubble px-4 py-2"
              } bg-base-300 rounded-[20px] flex flex-col ${
                message.senderId === authUser._id ? "bg-primary" : ""
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-[20px]"
                />
              )}
              {message.text && (
                <p
                  className={`${
                    message.senderId === authUser._id ? "text-white" : ""
                  }`}
                >
                  {message.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}
