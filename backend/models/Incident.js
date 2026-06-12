import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter incident title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter incident description']
  },
  type: {
    type: String,
    enum: ['Signal Loss', 'Audio Fault', 'IP Intrusion', 'Hardware Failure', 'Other'],
    required: [true, 'Please select incident type']
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'investigating', 'resolved'],
    default: 'open'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Người báo cáo sự cố
    required: true
  },
  ipAddress: {
    type: String, // Lưu vết IP thiết bị lỗi phục vụ IP-Based Security
    trim: true
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;