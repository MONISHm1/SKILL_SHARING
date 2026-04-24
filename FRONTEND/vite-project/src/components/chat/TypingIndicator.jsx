    const TypingIndicator = () => {
  return (
    <div className="flex justify-start px-2 py-1">
      <div
        className="
          flex items-center gap-1
          px-3 py-2
          rounded-2xl
          bg-[var(--card)]
          border border-[var(--border)]
        "
      >
        
        <span className="w-2 h-2 bg-[var(--text)] rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-[var(--text)] rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-[var(--text)] rounded-full animate-bounce" />
      </div>
    </div>
  );
};

export default TypingIndicator;