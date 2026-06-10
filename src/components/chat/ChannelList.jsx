import { Hash } from "lucide-react";

export default function ChannelList({ channels, activeChannel, onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
      {channels.map(ch => (
        <button
          key={ch}
          onClick={() => onSelect(ch)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
            activeChannel === ch
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Hash className="h-3.5 w-3.5 shrink-0" />
          {ch}
        </button>
      ))}
    </div>
  );
}