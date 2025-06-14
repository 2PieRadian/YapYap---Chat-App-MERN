import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Users } from "lucide-react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

export default function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => onlineUsers.includes(user._id));

  if (window.innerWidth <= 768) return;
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="hidden lg:flex h-full min-w-72 border-r border-base-300 flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full h-[64.8px] flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 h-[56px]">
          <Users className="size-6 cursor-pointer text-primary" />
          <span className="font-medium hidden lg:block">Online users</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full pb-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 cursor-pointer
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0 bg-[#d0d4d8] rounded-full shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="w-[48px] h-[48px] object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-300 
                  rounded-full ring-1 ring-green-700"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-green-500 ">Online</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
