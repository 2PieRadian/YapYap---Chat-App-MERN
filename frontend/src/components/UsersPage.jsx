import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function UsersPage() {
  const { users, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="w-full">
      <div className="box-border flex justify-between items-center p-4 h-[64.8px] f border-b-[1px] border-base-300">
        <h1 className="font-bold text-[20px]">All Users</h1>
        <button className="bg-primary text-amber-50 py-[6px] px-4 rounded-4xl cursor-pointer hover:scale-105 transition">
          Create Group
        </button>
      </div>

      <div className="overflow-scroll h-full pb-20">
        {users?.map((user) => (
          <div
            key={user._id}
            className="w-full flex items-center p-3 border-base-300 border-b-[1px] cursor-pointer hover:bg-base-200"
            onClick={() => handleSelectedUser(user)}
          >
            {/* User Image */}
            <div className="">
              <img
                src={user?.profilePic || "/avatar.png"}
                className="size-12 object-cover rounded-full mr-4 bg-base-300"
                alt={user?.fullName}
              />
            </div>

            {/* User Name and Online Status */}
            <div className="">
              <p className="text-[18px]">{user.fullName}</p>
              <p
                className={`text-[14px] ${
                  onlineUsers.includes(user._id) ? "text-green-500" : ""
                }`}
              >
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
