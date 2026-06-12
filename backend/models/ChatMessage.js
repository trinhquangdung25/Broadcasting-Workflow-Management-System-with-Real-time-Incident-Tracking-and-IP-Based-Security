import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Người gửi tin nhắn
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message content cannot be empty'],
    trim: true
  },
  room: {
    type: String,
    default: 'broadcasting-room' // Phòng chat chung của ca trực
  },
  createdAt: {
    type: Date,
    default: Date.now // Sắp xếp tin nhắn theo thời gian thực
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;