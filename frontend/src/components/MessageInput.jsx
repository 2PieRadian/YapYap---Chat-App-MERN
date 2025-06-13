import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // Eg. 'image/png'
  const fileInputRef = useRef(null);
  const { sendMessageViaSocket } = useChatStore();
  const { socket } = useAuthStore();
  const { typing, selectedUser } = useChatStore();
  const typingTimer = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    // Below line, reads the entire file asynchronously and when its done it fires the "onloadend" event
    reader.readAsDataURL(file);
    // When this event is fired just set the Image Preview
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // If no text is typed and no image has been selected
    if (!text.trim() && !imagePreview) return;

    try {
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await sendMessageViaSocket({
        text: text.trim(),
        image: imagePreview,
      });
    } catch (err) {
      console.log("Failed to send the message", err);
      toast.error("Failed to send the message");
    }
  };

  function handleTyping() {
    socket.emit("typing", selectedUser._id);

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("not-typing", selectedUser._id);
    }, 1000);
  }

  return (
    <div className="w-full border-t-[1px] border-base-300 sticky bottom-0 left-0">
      {/* Typing Indicator */}
      {typing ? (
        <div className="pl-4 py-1 bg-base-300">
          {selectedUser.fullName.split(" ")[0]} is typing...
        </div>
      ) : null}

      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="ml-2 mt-2 z-10 w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-[4px] -right-[11px] w-6 h-6 rounded-full bg-base-300
              flex items-center justify-center cursor-pointer"
              type="button"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex h-14 items-center">
        <div className="flex-1 flex h-full items-center">
          {/* Typing Input */}
          <input
            type="text"
            autoComplete="off"
            autoFocus
            className="w-full pl-4 h-full flex text-[18px] focus:outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
          />

          {/* File Hidden Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* File Input Button */}
          <button
            type="button"
            className={`flex items-center px-3 h-full rounded-none cursor-pointer ${
              imagePreview ? "text-primary" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={23} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          onMouseDown={(e) => e.preventDefault()}
          className={`h-full flex items-center px-2 pr-4 cursor-pointer rounded-none ${
            text.trim() || imagePreview ? "text-primary" : "text-zinc-400"
          }`}
          disabled={!text?.trim() && !imagePreview}
        >
          <Send size={23} />
        </button>
      </form>
    </div>
  );
}
