import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

export default function ChatHeader() {
  const { selectedUser, setSelectedUser, setViewSelectedUserProfile } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="sticky top-0 p-2.5 border-b border-base-300 flex">
      {/* Close button */}
      <button
        className="flex items-center justify-center cursor-pointer w-11 p-2 rounded-full hover:bg-base-300"
        onClick={() => setSelectedUser(null)}
      >
        <ArrowLeft />
      </button>

      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer h-[100%] px-2"
          onClick={() => setViewSelectedUserProfile(true)}
        >
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                className="bg-base-300"
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p
              className={`text-sm text-base-content/70 ${
                onlineUsers.includes(selectedUser._id) ? "text-green-500" : ""
              }`}
            >
              {onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "last seen at " + selectedUser.lastOnline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
