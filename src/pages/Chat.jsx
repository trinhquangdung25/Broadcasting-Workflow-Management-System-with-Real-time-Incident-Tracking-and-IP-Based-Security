import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Hash, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessageItem from "../components/chat/ChatMessageItem";
import ChannelList from "../components/chat/ChannelList";
import NewChannelDialog from "../components/chat/NewChannelDialog";

const DEFAULT_CHANNELS = ["general", "engineering", "transmission", "incidents"];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [activeChannel, setActiveChannel] = useState("general");
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const loadMessages = async () => {
    const data = await base44.entities.ChatMessage.filter({ channel: activeChannel }, "-created_date", 100);
    setMessages(data.reverse());
  };

  useEffect(() => {
    loadMessages();
    const unsub = base44.entities.ChatMessage.subscribe((event) => {
      if (event.data?.channel === activeChannel || event.type === "delete") {
        loadMessages();
      }
    });
    return unsub;
  }, [activeChannel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    await base44.entities.ChatMessage.create({
      content: newMessage.trim(),
      channel: activeChannel,
      author_name: user.full_name || user.email,
      author_email: user.email,
      message_type: "text",
    });
    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addChannel = (name) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (slug && !channels.includes(slug)) {
      setChannels([...channels, slug]);
      setActiveChannel(slug);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-56 border-r bg-card flex flex-col shrink-0 hidden sm:flex">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-semibold">Channels</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setChannelDialogOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ChannelList channels={channels} activeChannel={activeChannel} onSelect={setActiveChannel} />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="h-14 border-b flex items-center px-4 gap-2 bg-card">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">{activeChannel}</h3>
          <span className="text-xs text-muted-foreground ml-2">{messages.length} messages</span>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(msg => (
              <ChatMessageItem key={msg.id} message={msg} isOwn={msg.author_email === user?.email} />
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${activeChannel}...`}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <NewChannelDialog open={channelDialogOpen} onOpenChange={setChannelDialogOpen} onAdd={addChannel} />
    </div>
  );
}