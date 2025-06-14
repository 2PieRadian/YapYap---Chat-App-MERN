import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import UsersPage from "../components/UsersPage";
import Navbar from "../components/Navbar";
import UserProfile from "../components/UserProfile";

export default function HomePage() {
  const { selectedUser } = useChatStore();
  const { viewSelectedUserProfile } = useChatStore();

  return (
    <div className="relative">
      {!selectedUser && <Navbar />}
      <div
        // Height according to the selected user
        className={`${
          selectedUser ? "h-[100vh]" : "h-[calc(100vh-64.8px)]"
        } bg-base-200`}
      >
        <div className="h-full flex items-center justify-center">
          <div className="h-full bg-base-100 rounded-lg shadow-xl w-full">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />

              {!selectedUser ? (
                <UsersPage />
              ) : viewSelectedUserProfile ? (
                <UserProfile />
              ) : (
                <ChatContainer />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
