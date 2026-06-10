import { useState, useEffect } from "react";
// 1. Dùng apiClient và socket thay cho base44
import { apiClient } from "@/api/base44Client"; 
import { io } from "socket.io-client";

import { Link } from "react-router-dom";
import {
  Activity, AlertTriangle, CheckCircle, Clock,
  Radio, ArrowRight, TrendingUp, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatusBadge from "../components/StatusBadge";
import RecentIncidents from "../components/dashboard/RecentIncidents";
import StatsCards from "../components/dashboard/StatsCards";
import WorkflowChart from "../components/dashboard/WorkflowChart";

// Đảm bảo trỏ đúng cổng Backend Node.js của bạn
const SOCKET_URL = "http://localhost:5000";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Hàm gọi REST API lấy dữ liệu song song
  const loadDashboardData = async () => {
    try {
      // Gọi lên Node.js bằng phương thức GET
      const [resTasks, resIncidents] = await Promise.all([
        apiClient.get("/tasks"),       // Lấy danh sách công việc
        apiClient.get("/incidents")    // Lấy danh sách sự cố
      ]);
      
      setTasks(resTasks.data);
      setIncidents(resIncidents.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Khởi tạo dữ liệu và cấu hình Socket.io
  useEffect(() => {
    // Tải dữ liệu lần đầu khi vừa vào trang
    loadDashboardData();

    // Kết nối Socket để nhận thông báo thời gian thực
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("jwt_token") }
    });

    // Lắng nghe các thay đổi từ Backend để auto-refresh Dashboard
    socket.on("taskUpdated", () => loadDashboardData());
    socket.on("newIncident", () => loadDashboardData());
    socket.on("incidentUpdated", () => loadDashboardData());

    // Dọn dẹp kết nối khi rời khỏi trang Dashboard
    return () => socket.close();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Broadcasting workflow overview & system status</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-live" />
          Systems Online
        </div>
      </div>

      {/* Các Component con giao diện giữ nguyên hoàn toàn */}
      <StatsCards tasks={tasks} incidents={incidents} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkflowChart tasks={tasks} />
        </div>
        <RecentIncidents incidents={incidents} />
      </div>
    </div>
  );
}