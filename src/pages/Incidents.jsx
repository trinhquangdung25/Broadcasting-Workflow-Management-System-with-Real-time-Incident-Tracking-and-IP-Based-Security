import { useState, useEffect } from "react";
// 1. Import apiClient và socket thay vì base44
import { apiClient } from "@/api/base44Client";
import { io } from "socket.io-client";

import { Plus, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import StatusBadge from "../components/StatusBadge";
import IncidentDialog from "../components/incidents/IncidentDialog";
import IncidentRow from "../components/incidents/IncidentRow";

// Khai báo địa chỉ server Node.js của bạn
const SOCKET_URL = "http://localhost:5000";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIncident, setEditIncident] = useState(null);

  // 2. Viết lại hàm tải dữ liệu bằng REST API (Axios)
  const loadIncidents = async () => {
    try {
      // Gọi GET /api/incidents từ Node.js (Backend tự sắp xếp mới nhất lên đầu)
      const response = await apiClient.get("/incidents");
      setIncidents(response.data);
    } catch (error) {
      console.error("Error loading incident list:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Khởi tạo dữ liệu và cấu hình Socket.io
  useEffect(() => {
    loadIncidents();

    // Khởi tạo kết nối Socket kèm Token xác thực
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("jwt_token") }
    });

    // Lắng nghe các sự kiện thay đổi dữ liệu từ Backend
    socket.on("newIncident", loadIncidents);
    socket.on("incidentUpdated", loadIncidents);
    socket.on("incidentDeleted", loadIncidents);

    // Ngắt kết nối khi chuyển sang trang khác
    return () => socket.close();
  }, []);

  const handleCreate = () => { setEditIncident(null); setDialogOpen(true); };
  const handleEdit = (inc) => { setEditIncident(inc); setDialogOpen(true); };

  // Logic lọc dữ liệu phía client giữ nguyên
  const filtered = incidents.filter(i => {
    if (search && !i.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSeverity !== "all" && i.severity !== filterSeverity) return false;
    if (filterStatus !== "all" && i.status !== filterStatus) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-destructive" /> Incident Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time incident monitoring & response</p>
        </div>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Report Incident
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incidents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No incidents found</p>
          </div>
        ) : (
          filtered.map(incident => (
            <IncidentRow key={incident.id || incident._id} incident={incident} onEdit={() => handleEdit(incident)} />
          ))
        )}
      </div>

      {/* Truyền hàm loadIncidents vào onSaved để làm mới danh sách sau khi tạo/sửa thành công */}
      <IncidentDialog open={dialogOpen} onOpenChange={setDialogOpen} incident={editIncident} onSaved={loadIncidents} />
    </div>
  );
}