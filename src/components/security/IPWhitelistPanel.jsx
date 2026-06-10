import { useState, useEffect } from "react";
// 1. Thay thế base44 bằng apiClient
import { apiClient } from "@/api/base44Client";
import { Plus, Trash2, Shield, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const DEPARTMENTS = ["engineering", "production", "transmission", "management", "other"];

export default function IPWhitelistPanel({ isAdmin }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ ip_address: "", label: "", department: "other" });

  // 2. Viết lại hàm tải danh sách IP tin cậy bằng REST API (GET)
  const load = async () => {
    try {
      // Gọi API Node.js: GET /api/network/whitelist
      const response = await apiClient.get("/network/whitelist");
      setEntries(response.data);
    } catch (error) {
      console.error("Lỗi tải danh sách IP Whitelist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // 3. Viết lại hàm Thêm IP mới bằng REST API (POST)
  const handleAdd = async () => {
    if (!form.ip_address.trim() || !form.label.trim()) return;
    
    try {
      const payload = { ...form, is_active: true };
      // Gọi API Node.js: POST /api/network/whitelist
      // (Backend tự giải mã token lấy email người tạo, không cần gọi hàm auth.me ở đây)
      await apiClient.post("/network/whitelist", payload);
      
      setForm({ ip_address: "", label: "", department: "other" });
      setDialogOpen(false);
      load(); // Reload dữ liệu bảng
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ IP:", error);
    }
  };

  // 4. Viết lại hàm Bật/Tắt kích hoạt IP bằng REST API (PUT)
  const handleToggle = async (entry) => {
    const entryId = entry.id || entry._id;
    try {
      // Gọi API Node.js: PUT /api/network/whitelist/:id/toggle
      await apiClient.put(`/network/whitelist/${entryId}`, { is_active: !entry.is_active });
      load();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái IP:", error);
    }
  };

  // 5. Viết lại hàm Xóa IP bằng REST API (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this IP from whitelist?")) {
      try {
        // Gọi API Node.js: DELETE /api/network/whitelist/:id
        await apiClient.delete(`/network/whitelist/${id}`);
        load();
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ IP:", error);
      }
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">IP Address Whitelist</CardTitle>
        {isAdmin && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add IP
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No IP addresses whitelisted yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map(entry => {
              const entryId = entry.id || entry._id;
              return (
                <div key={entryId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`h-2 w-2 rounded-full ${entry.is_active ? "bg-green-500" : "bg-red-500"}`} />
                  <code className="text-sm font-mono font-medium flex-1">{entry.ip_address}</code>
                  <span className="text-sm text-muted-foreground hidden sm:inline">{entry.label}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {entry.department}
                  </Badge>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleToggle(entry)}>
                        {entry.is_active ? <X className="h-3.5 w-3.5 text-red-500" /> : <Check className="h-3.5 w-3.5 text-green-500" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(entryId)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Hộp thoại thêm mới IP */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add IP Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>IP Address</Label>
              <Input value={form.ip_address} onChange={e => setForm({ ...form, ip_address: e.target.value })} placeholder="192.168.1.1" className="font-mono" />
            </div>
            <div>
              <Label>Label</Label>
              <Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Studio A Control Room" />
            </div>
            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd} disabled={!form.ip_address.trim() || !form.label.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}