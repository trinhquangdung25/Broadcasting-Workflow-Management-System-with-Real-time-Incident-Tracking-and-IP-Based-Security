import { useState, useEffect } from "react";
// 1. Dùng apiClient và useAuth thay cho base44
import { apiClient } from "@/api/apiService";
import { useAuth } from "@/lib/AuthContext";

import { Settings as SettingsIcon, User, Cpu, Shield, Zap, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

const DEPARTMENTS = ["engineering", "production", "transmission", "management", "other"];

export default function Settings() {
  // 2. Lấy user từ Context thay vì tự gọi API
  const { user } = useAuth();
  const [department, setDepartment] = useState("other");
  const [saving, setSaving] = useState(false);

  // Đồng bộ state với data của user khi Context đã load xong
  useEffect(() => {
    if (user) {
      setDepartment(user.department || "other");
    }
  }, [user]);

  // 3. Hàm lưu thông tin sử dụng REST API (Axios)
  const handleSave = async () => {
    setSaving(true);
    try {
      // Gửi request PUT lên Backend Node.js để cập nhật Department
      await apiClient.put("/auth/profile", { department });
      
      toast({ title: "Settings saved", description: "Your profile has been updated." });
      
      // Lưu ý: Tuỳ thuộc vào cách bạn code AuthContext sau này, 
      // bạn có thể gọi hàm cập nhật lại Context ở đây để đồng bộ toàn app.
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({ 
        title: "Update failed", 
        description: "There was an error saving your preferences.", 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  // Tránh render lỗi nếu user chưa load kịp
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences</p>
      </div>

      {/* Cấu hình Profile */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={user.full_name || ""} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email || ""} disabled className="bg-muted" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={user.role || "viewer"} disabled className="bg-muted capitalize" />
          </div>
          <div>
            <Label>Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Methods & Technologies (Giữ nguyên giao diện tĩnh) */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="h-4 w-4" /> Methods &amp; Technologies
          </CardTitle>
          <p className="text-xs text-muted-foreground">Architecture and implementation techniques used in this platform</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TECH_STACK.map(({ icon: Icon, title, color, bg, items }) => (
              <div key={title} className={`rounded-xl border p-4 ${bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-8 w-8 rounded-lg bg-background/60 flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <h3 className={`text-sm font-semibold ${color}`}>{title}</h3>
                </div>
                <ul className="space-y-2">
                  {items.map(({ label, desc }) => (
                    <li key={label} className="text-xs">
                      <span className="font-semibold text-foreground">{label}</span>
                      {desc && <span className="text-muted-foreground"> — {desc}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Khai báo tĩnh thông tin về công nghệ của đồ án
const TECH_STACK = [
  {
    icon: Layers,
    title: "Full-stack Architecture",
    color: "text-blue-500",
    bg: "bg-blue-500/5 border-blue-500/20",
    items: [
      { label: "MongoDB", desc: "High-performance document storage for workflows & incidents" },
      { label: "Express.js", desc: "RESTful API layer with middleware pipeline" },
      { label: "React", desc: "Component-driven UI with hooks-based state management" },
      { label: "Node.js", desc: "Async event loop powering the backend runtime" },
    ],
  },
  {
    icon: Zap,
    title: "Real-time Synchronization",
    color: "text-amber-500",
    bg: "bg-amber-500/5 border-amber-500/20",
    items: [
      { label: "Socket.io", desc: "Bidirectional, low-latency WebSocket communication" },
      { label: "Live Incident Alerts", desc: "Emergency notifications pushed instantly to all clients" },
      { label: "Status Sync", desc: "Workflow state changes propagated in real time" },
      { label: "Entity Subscriptions", desc: "Fine-grained per-entity change listeners" },
    ],
  },
  {
    icon: Cpu,
    title: "Frontend Interactivity",
    color: "text-purple-500",
    bg: "bg-purple-500/5 border-purple-500/20",
    items: [
      { label: "React Context API", desc: "Global state management for auth & app settings" },
      { label: "@hello-pangea/dnd", desc: "Drag-and-drop Kanban board with optimistic updates" },
      { label: "Recharts", desc: "Pipeline analytics and incident trend visualizations" },
      { label: "Framer Motion", desc: "Smooth transitions for alerts and panel animations" },
    ],
  },
  {
    icon: Shield,
    title: "Security & Verification",
    color: "text-green-500",
    bg: "bg-green-500/5 border-green-500/20",
    items: [
      { label: "JWT Tokens", desc: "Signed session tokens for stateless authentication" },
      { label: "IP Whitelisting", desc: "Network-layer access control for broadcasting infrastructure" },
      { label: "RBAC", desc: "Role-based permissions: Admin, Engineer, Operator, Viewer" },
      { label: "IP Verification", desc: "Restricts operations to the secured broadcasting network" },
    ],
  },
];