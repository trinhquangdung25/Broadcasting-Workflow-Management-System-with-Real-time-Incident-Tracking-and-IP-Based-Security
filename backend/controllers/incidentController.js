import Incident from '../models/Incident.js';

// @desc    Create a new incident (Realtime alert)
// @route   POST /api/incidents
// @access  Private (Admin, Manager, Engineer, Operator)
export const createIncident = async (req, res) => {
  const { title, description, type, severity, ipAddress } = req.body;

  try {
    const incident = await Incident.create({
      title,
      description,
      type,
      severity,
      ipAddress,
      reportedBy: req.user._id // Lấy ID của user đang đăng nhập từ authMiddleware
    });

    if (incident) {
      // Populated thông tin người báo cáo để hiển thị tên đẹp đẽ bên Frontend
      const populatedIncident = await Incident.findById(incident._id).populate('reportedBy', 'name role');

      // 📡 LẤY BIẾN SOCKET.IO ĐÃ LƯU Ở SERVER.JS ĐỂ BẮN REALTIME
      const io = req.app.get('io');
      if (io) {
        io.emit('new_incident', populatedIncident); // Bắn thẳng sang mọi màn hình Frontend đang mở
        console.log(`📡 Realtime broadcast: New incident created [${title}]`);
      }

      res.status(201).json(populatedIncident);
    } else {
      res.status(400).json({ message: 'Invalid incident data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private (All roles)
export const getIncidents = async (req, res) => {
  try {
    // Lấy toàn bộ sự cố, sắp xếp cái mới nhất lên đầu và kèm thông tin người báo cáo
    const incidents = await Incident.find({})
      .populate('reportedBy', 'name role')
      .sort({ createdAt: -1 });
      
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update incident status or severity
// @route   PUT /api/incidents/:id
// @access  Private (Admin, Manager, Engineer)
export const updateIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // Cập nhật các trường dữ liệu nếu phía client gửi lên
    incident.title = req.body.title || incident.title;
    incident.description = req.body.description || incident.description;
    incident.type = req.body.type || incident.type;
    incident.severity = req.body.severity || incident.severity;
    incident.status = req.body.status || incident.status;
    incident.ipAddress = req.body.ipAddress || incident.ipAddress;

    // Nếu trạng thái đổi sang 'resolved' thì tự động ghi nhận thời gian xử lý xong
    if (req.body.status === 'resolved') {
      incident.resolvedAt = Date.now();
    }

    const updatedIncident = await incident.save();
    const populatedIncident = await Incident.findById(updatedIncident._id).populate('reportedBy', 'name role');

    // 📡 Bắn realtime cho Frontend biết sự cố vừa được cập nhật trạng thái
    const io = req.app.get('io');
    if (io) {
      io.emit('update_incident', populatedIncident);
    }

    res.json(populatedIncident);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};