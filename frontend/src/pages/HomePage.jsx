import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import UsersPage from "../components/UsersPage";

export default function HomePage() {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-[calc(100vh-64.8px)] bg-base-200">
      <div className="flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-xl w-full maxw-6xl h-[calc(100vh-64.8px)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <UsersPage /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
