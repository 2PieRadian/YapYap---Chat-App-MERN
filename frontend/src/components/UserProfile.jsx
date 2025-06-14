import { useAuthStore } from "../store/useAuthStore";
import { ArrowLeft, Mail } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

export default function UserProfile() {
  const { selectedUser, setViewSelectedUserProfile } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="bg-base-200 w-full h-full">
      {/* Profile Image & Name */}
      <div className="relative flex flex-col items-center justify-center w-full">
        {/* Back Button */}
        <button
          className=" transition duration-200 m-2 hover:bg-base-300 rounded-full cursor-pointer absolute top-0 left-0"
          onClick={() => setViewSelectedUserProfile(false)}
        >
          <ArrowLeft className="m-3 " size={30} />
        </button>

        {/* Profile Picture */}
        <img
          src={selectedUser.profilePic}
          className="h-[40vh] rounded-full mt-14 border-4"
          alt="user-image"
        />

        {/* Full Name */}
        <h1 className="text-3xl font-bold mt-[30px]">
          {selectedUser.fullName}
        </h1>

        {/* Last Seen */}
        <p className="mt-1">
          {onlineUsers.includes(selectedUser._id)
            ? "Online"
            : "last seen at " + selectedUser.lastOnline}
        </p>

        {/* Email */}
        <a
          href={`mailto:${selectedUser.email}`}
          className="bg-primary py-2 px-4 mt-4 rounded-2xl hover:scale-105 transition hover:bg-opacity-80"
        >
          <span className="flex items-center justify-between text-amber-50">
            <Mail size={20} /> &nbsp; {selectedUser.email}
          </span>
        </a>
      </div>
    </div>
  );
}
