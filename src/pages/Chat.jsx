import React, { useState, useEffect, useRef } from 'react';

const INITIAL_CHANNELS = ['general', 'engineering', 'transmission', 'incidents'];

const INITIAL_MESSAGES = [
  { id: '1', channel: 'general', text: "Heads up team - we're seeing some encoder issues on the primary feed. Engineering is investigating.", author_name: 'Sarah Chen', author_initials: 'sc', timestamp: '9:57 AM', isMe: false },
  { id: '2', channel: 'general', text: "ok", author_name: 'Quang Dũng Trịnh', author_initials: 'QT', timestamp: '10:05 AM', isMe: true },
];

export default function Chat() {
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const messagesEndRef = useRef(null);
  const currentMessages = messages.filter(m => m.channel === activeChannel);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const timeNow = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    const newMsg = {
      id: Date.now().toString(),
      channel: activeChannel,
      text: newMessage.trim(),
      author_name: 'Quang Dũng Trịnh',
      author_initials: 'QT',
      timestamp: timeNow,
      isMe: true 
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleKeyDown = (e) => {
    // SỬA LỖI DOUBLE-SEND: Bỏ qua sự kiện Enter nếu người dùng đang dùng bộ gõ tiếng Việt để chốt chữ
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateChannel = (e) => {
    e.preventDefault();
    const cleanName = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (cleanName && !channels.includes(cleanName)) {
      setChannels(prev => [...prev, cleanName]);
      setActiveChannel(cleanName);
    }
    setIsCreatingChannel(false);
    setNewChannelName('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden h-[calc(100vh-8rem)]">
      
      {/* CỘT TRÁI: DANH SÁCH CHANNELS */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Channels</h2>
          <button 
            onClick={() => setIsCreatingChannel(true)}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
        <div className="p-3 overflow-y-auto custom-scrollbar flex-1 space-y-0.5">
          {channels.map(channel => (
            <button
              key={channel}
              onClick={() => setActiveChannel(channel)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeChannel === channel 
                  ? 'bg-blue-100/50 text-blue-600' 
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
              }`}
            >
              <span className="text-slate-400 font-normal">#</span> {channel}
            </button>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: KHU VỰC CHAT */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-3 shrink-0">
          <h3 className="font-bold text-slate-800 flex items-center gap-1">
            <span className="text-slate-400 font-normal">#</span> {activeChannel}
          </h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {currentMessages.length} messages
          </span>
        </div>

        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {currentMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-3 h-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar LUÔN hiển thị */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm ${msg.isMe ? 'bg-[#293c8b] text-white' : 'bg-slate-200 text-slate-600 uppercase'}`}>
                  {msg.author_initials}
                </div>

                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  
                  {/* Tên và Thời gian LUÔN hiển thị */}
                  <div className="flex items-baseline gap-2 mb-1.5">
                    {msg.isMe ? (
                      <>
                        <span className="text-[11px] font-medium text-slate-400/80">{msg.timestamp}</span>
                        <span className="text-[14px] font-bold text-[#202937]">{msg.author_name}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[14px] font-bold text-[#202937]">{msg.author_name}</span>
                        <span className="text-[11px] font-medium text-slate-400/80">{msg.timestamp}</span>
                      </>
                    )}
                  </div>
                  
                  <div className={`px-4 py-2.5 text-[13.5px] leading-relaxed shadow-sm ${
                    msg.isMe 
                      ? 'bg-[#4b7aec] text-white rounded-l-2xl rounded-tr-sm rounded-br-2xl' 
                      : 'bg-slate-100/80 text-slate-800 rounded-r-2xl rounded-tl-sm rounded-bl-2xl'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="relative flex items-end bg-white border border-slate-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${activeChannel}...`}
              className="w-full max-h-32 min-h-[44px] p-3 pr-12 resize-none outline-none text-sm text-slate-800 custom-scrollbar"
              rows="1"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="absolute right-2 bottom-2 p-1.5 text-white bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for new line
          </p>
        </div>
      </div>

      {isCreatingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Create Channel</h2>
              <button onClick={() => setIsCreatingChannel(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="p-6">
              <form id="channel-form" onSubmit={handleCreateChannel} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Channel Name</label>
                  <input 
                    autoFocus
                    value={newChannelName} 
                    onChange={(e) => setNewChannelName(e.target.value)} 
                    placeholder="e.g. studio-a" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none" 
                    required 
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button type="submit" form="channel-form" className="bg-[#93c5fd] hover:bg-[#60a5fa] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors shadow-sm">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}