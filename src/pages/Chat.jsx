import { useState, useEffect, useRef } from "react";
// 1. Xóa import base44, thêm thư viện của MERN
import { apiClient } from "@/api/Client"; // Lát bạn có thể đổi tên file apiClient sau
import { io } from "socket.io-client";
import { useAuth } from "@/lib/AuthContext"; // Dùng Context lấy User

import { Send, Hash, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessageItem from "../components/chat/ChatMessageItem";
import ChannelList from "../components/chat/ChannelList";
import NewChannelDialog from "../components/chat/NewChannelDialog";

const DEFAULT_CHANNELS = ["general", "engineering", "transmission", "incidents"];

// Khai báo địa chỉ server Node.js của bạn (thường là port 5000)
const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState(DEFAULT_CHANNELS);
  const [activeChannel, setActiveChannel] = useState("general");
  const [newMessage, setNewMessage] = useState("");
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const scrollRef = useRef(null);
  
  // 2. Lấy user từ AuthContext thay vì tự fetch
  const { user } = useAuth(); 
  const [socket, setSocket] = useState(null);

  // Khởi tạo kết nối Socket.io khi vào trang Chat
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      // Gửi kèm token để Backend Node.js xác thực
      auth: { token: localStorage.getItem("jwt_token") } 
    });
    setSocket(newSocket);

    // Dọn dẹp kết nối khi rời khỏi trang Chat
    return () => newSocket.close();
  }, []);

  // 3. Tải lịch sử tin nhắn bằng REST API (Axios)
  const loadMessages = async () => {
    try {
      // Gọi lên Node.js: GET /api/chat/messages?channel=general
      const response = await apiClient.get(`/chat/messages?channel=${activeChannel}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading message history:", error);
    }
  };

  // 4. Quản lý luồng dữ liệu (Load dữ liệu & Lắng nghe Real-time)
  useEffect(() => {
    loadMessages();

    if (!socket) return;

    // Lắng nghe sự kiện "newMessage" phát ra từ Backend Node.js
    const handleNewMessage = (incomingMsg) => {
      // Chỉ push vào màn hình nếu tin nhắn thuộc kênh đang xem
      if (incomingMsg.channel === activeChannel) {
        setMessages((prev) => [...prev, incomingMsg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeChannel, socket]);

  // Cuộn xuống cuối cùng khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 5. Gửi tin nhắn mới bằng REST API POST
  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      const payload = {
        content: newMessage.trim(),
        channel: activeChannel,
        author_name: user.full_name || user.email,
        author_email: user.email,
        message_type: "text",
      };

      // Tạm thời hiển thị tin nhắn ngay lập tức (Optimistic UI) để trải nghiệm mượt
      setMessages((prev) => [...prev, { ...payload, id: Date.now(), created_date: new Date() }]);
      setNewMessage("");

      // Gửi lên Node.js lưu vào MongoDB. Sau khi lưu, Node.js sẽ dùng socket.emit() báo cho những người khác
      await apiClient.post("/chat/messages", payload);
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
      {/* Sidebar Channels */}
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

        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessageItem key={msg.id || msg._id} message={msg} isOwn={msg.author_email === user?.email} />
            ))
          )}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
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