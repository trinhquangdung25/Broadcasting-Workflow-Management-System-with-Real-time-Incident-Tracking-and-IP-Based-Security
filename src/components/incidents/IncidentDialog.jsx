import { useState, useEffect } from "react";
// 1. Thay thế base44 bằng apiClient
import { apiClient } from "@/api/Client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

const SEVERITIES = ["info", "warning", "error", "critical"];
const STATUSES = ["open", "investigating", "resolved", "closed"];
const SYSTEMS = ["video_feed", "audio_feed", "encoder", "transmitter", "playout", "network", "storage", "other"];

export default function IncidentDialog({ open, onOpenChange, incident, onSaved }) {
  const [form, setForm] = useState({
    title: "", description: "", severity: "info", status: "open",
    affected_system: "other", assigned_to: "", resolution_notes: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (incident) {
      setForm({
        title: incident.title || "",
        description: incident.description || "",
        severity: incident.severity || "info",
        status: incident.status || "open",
        affected_system: incident.affected_system || "other",
        assigned_to: incident.assigned_to || "",
        resolution_notes: incident.resolution_notes || "",
      });
    } else {
      setForm({ title: "", description: "", severity: "info", status: "open", affected_system: "other", assigned_to: "", resolution_notes: "" });
    }
  }, [incident, open]);

  // 2. Chuyển đổi hàm lưu log sự cố sang REST API (POST/PUT)
  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    
    const data = { ...form };
    if (form.status === "resolved" && incident?.status !== "resolved") {
      data.resolved_at = new Date().toISOString();
    }

    const incidentId = incident?.id || incident?._id;

    try {
      if (incident) {
        // Gọi API Node.js: PUT /api/incidents/:id
        await apiClient.put(`/incidents/${incidentId}`, data);
      } else {
        // Gọi API Node.js: POST /api/incidents
        await apiClient.post("/incidents", data);
      }
      onOpenChange(false);
      onSaved(); // Kích hoạt reload danh sách lỗi bên trang chính
    } catch (error) {
      console.error("Error saving incident information:", error);
    } finally {
      setSaving(false);
    }
  };

  // 3. Chuyển đổi hàm Xóa sự cố sang REST API (DELETE)
  const handleDelete = async () => {
    if (!incident) return;
    const incidentId = incident.id || incident._id;

    if (window.confirm("Are you sure you want to completely delete this incident record?")) {
      try {
        // Gọi API Node.js: DELETE /api/incidents/:id
        await apiClient.delete(`/incidents/${incidentId}`);
        onOpenChange(false);
        onSaved(); // Làm mới lại UI danh sách sự cố
      } catch (error) {
        console.error("Error deleting incident:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{incident ? "Edit Incident" : "Report Incident"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Incident summary..." />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detailed description..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Severity</Label>
              <Select value={form.severity} onValueChange={v => setForm({ ...form, severity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Affected System</Label>
              <Select value={form.affected_system} onValueChange={v => setForm({ ...form, affected_system: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SYSTEMS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned To</Label>
              <Input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} placeholder="user@example.com" />
            </div>
          </div>
          {incident && (
            <div>
              <Label>Resolution Notes</Label>
              <Textarea value={form.resolution_notes} onChange={e => setForm({ ...form, resolution_notes: e.target.value })} placeholder="How was this resolved?" rows={2} />
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          {incident && (
            <Button variant="ghost" size="sm" className="text-destructive mr-auto" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
            {saving ? "Saving..." : incident ? "Update" : "Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}