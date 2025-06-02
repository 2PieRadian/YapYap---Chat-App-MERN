import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  onlineUsers: [],

  // Get all the registered users from the database
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch all messages exchanged between the "authenticated user" and the "selected user"
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessageViaSocket: async (messageData) => {
    const { selectedUser, messages } = get();

    // Create an Optimistic Message with "temporary" ID
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: useAuthStore.getState().authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "Sending",
    };

    // Quickly update the "messages" for the Sender
    set({ messages: [...messages, optimisticMessage] });

    const socket = useAuthStore.getState().socket;

    // Send this Optimistic message to the Receiver
    socket.emit("newMessage", optimisticMessage);

    // Save the message to the DB
    try {
      await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
    } catch (err) {
      toast.error(err.response.data.message);
    }
  },

  // Subscribe to real-time incoming messages from the selected user via socket
  subscribeToMessages: () => {
    // If no user is selected then do not open the socket
    const { selectedUser } = get();
    if (!selectedUser) return;

    // Get the "socket" from the "useAuthStore" where the "client-socket" resides
    // We access it differently here because this file is a Zustand store itself
    // It Doesn't set up subscriptions & Just gives us the current state value
    const socket = useAuthStore.getState().socket;

    // Listen to an event called "newMessage" on this socket
    socket.on("newMessage", (newMessage) => {
      // If the message is not coming from the selected user - return
      if (newMessage.senderId !== selectedUser._id) return;

      // Update the "messages" for the 'receiver'
      set({ messages: [...get().messages, newMessage] });
    });

    // XX ---- This is not required ---- XX
    // Backend sends this to both the "sender" and "receiver" when the "optimistic message" is saved succesfully in the DB
    // socket.on("messagesUpdated", (newMessages) => {});
  },

  // Unsubscribe from the real-time "newMessage" socket event
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // Set the "selectedUser" state to the "user" object you click on
  setSelectedUser: (userId) => {
    set({ selectedUser: userId });
  },
}));
