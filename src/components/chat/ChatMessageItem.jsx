import moment from "moment";

export default function ChatMessageItem({ message, isOwn }) {
  const initials = (message.author_name || "?")
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
        isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      }`}>
        {initials}
      </div>
      <div className={`max-w-[70%] ${isOwn ? "text-right" : ""}`}>
        <div className="flex items-center gap-2 mb-0.5">
          {!isOwn && <span className="text-xs font-semibold">{message.author_name}</span>}
          <span className="text-[10px] text-muted-foreground">{moment(message.created_date).format("h:mm A")}</span>
        </div>
        <div className={`rounded-2xl px-3.5 py-2 text-sm inline-block ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted rounded-tl-sm"
        }`}>
          {message.content}
        </div>
      </div>
    </div>
  );
}