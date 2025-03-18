


const ChatMessage = ({ message }: { message: { role: string; content: string } }) => {
  return (
    <div className={`p-2 ${message.role === "user" ? "bg-yellow-100 text-black text-right" : "bg-neutral-600"}`}>
                {message.content}
              </div>
  );
};

export default ChatMessage;