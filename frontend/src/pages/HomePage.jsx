import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import UsersPage from "../components/UsersPage";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="relative bg-base-">
      {!selectedUser && <Navbar />}
      <div
        className={`${
          selectedUser ? "h-[100vh]" : "h-[calc(100vh-64.8px)]"
        } bg-base-200`}
      >
        <div className="h-full flex items-center justify-center">
          <div className="h-full bg-base-100 rounded-lg shadow-xl w-full maxw-6xl">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />

              {!selectedUser ? <UsersPage /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
