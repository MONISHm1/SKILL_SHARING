import { useState, useRef } from "react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!message.trim()) return;

    console.log("🔥 SEND CLICKED:", message);

    onSend(message);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-[var(--border)] bg-[var(--card)]">
      <textarea
        ref={textareaRef}
        value={message}
        rows={1}
        placeholder="Type a message..."
        className="flex-1 input resize-none overflow-hidden rounded-xl px-3 py-2"
        onChange={(e) => {
          setMessage(e.target.value);
          autoResize();
        }}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInput;