import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// 1. Loại bỏ base44, import apiClient, socket và useAuth
import { apiClient } from "@/api/base44Client";
import { io } from "socket.io-client";
import { useAuth } from "@/lib/AuthContext";

import {
  LayoutDashboard, Kanban, AlertTriangle, MessageSquare,
  Shield, Settings, ChevronLeft, ChevronRight, Radio, LogOut, User 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import IncidentNotificationBanner from "../components/IncidentNotificationBanner";

// Địa chỉ backend server của bạn
const SOCKET_URL = "http://localhost:5001";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/workflows", label: "Workflows", icon: Kanban }, // 2. Đổi từ /kanban thành /workflows
  { path: "/incidents", label: "Incidents", icon: AlertTriangle },
  { path: "/chat", label: "Team Chat", icon: MessageSquare },
  { path: "/security", label: "Security", icon: Shield },
  { path: "/settings", label: "Settings", icon: Settings }
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openIncidents, setOpenIncidents] = useState(0);

  // 3. Lấy thông tin user trực tiếp từ AuthContext
  const { user } = useAuth(); 

  // 4. Hàm lấy số lượng sự cố chưa xử lý từ MongoDB (REST API)
  const fetchOpenIncidentsCount = async () => {
    try {
      // Endpoint giả định: GET /api/incidents/count/open
      const response = await apiClient.get("/incidents/count/open");
      setOpenIncidents(response.data.count);
    } catch (error) {
      console.error("Errors get the number of incidents:", error);
    }
  };

  useEffect(() => {
    // Tải số lượng sự cố lần đầu
    fetchOpenIncidentsCount();

    // Kết nối Socket để lắng nghe thông báo sự cố realtime
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("jwt_token") }
    });

    // Cứ khi nào có sự cố mới hoặc sự cố được cập nhật/xóa, ta tự động gọi lại API để cập nhật Badge
    socket.on("newIncident", fetchOpenIncidentsCount);
    socket.on("incidentUpdated", fetchOpenIncidentsCount);
    socket.on("incidentDeleted", fetchOpenIncidentsCount);

    return () => socket.close();
  }, []);

  // 5. Hàm xử lý Đăng xuất chuẩn MERN Stack
  const handleLogout = () => {
    localStorage.removeItem("jwt_token"); // Xóa token đã lưu
    window.location.href = "/login"; // Chuyển hướng người dùng về trang đăng nhập
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Menu */}
      <aside className={`${collapsed ? "w-16" : "w-60"} bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 shrink-0`}>
        {/* Logo Hệ Thống */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <Radio className="text-sidebar-primary ml-2 h-6 w-6 shrink-0" />
          {!collapsed && (
            <span className="text-sidebar-accent-foreground ml-2 text-2xl font-extrabold tracking-wide">
              BROADCAST
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive ?
                  "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" :
                  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span className="font-medium">{label}</span>}
                
                {/* Số lượng lỗi hiển thị thời gian thực cạnh chữ Incidents */}
                {!collapsed && label === "Incidents" && openIncidents > 0 && (
                  <Badge variant="destructive" className="ml-auto h-5 min-w-5 text-[10px] px-1.5 flex items-center justify-center">
                    {openIncidents}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section Dropdown */}
        <div className="p-3 border-t border-sidebar-border">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors ${collapsed ? "justify-center" : ""}`}>
                  <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-sidebar-primary" />
                  </div>
                  {!collapsed && (
                    <div className="text-left overflow-hidden">
                      <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.full_name || "User"}</p>
                      <p className="text-[10px] text-sidebar-foreground truncate capitalize">{user.role || "viewer"}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Nút Thu Gọn / Mở Rộng Menu */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 flex items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      {/* Vùng hiển thị nội dung các trang con */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <IncidentNotificationBanner />
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}