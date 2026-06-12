import { useState, useEffect } from "react";
// 1. Thay base44 bằng apiClient
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

const STATUSES = ["backlog", "pre_production", "in_production", "transmission", "post_production", "completed"];
const PRIORITIES = ["low", "medium", "high", "critical"];
const CATEGORIES = ["video", "audio", "graphics", "transmission", "encoding", "playout", "other"];

export default function TaskDialog({ open, onOpenChange, task, onSaved }) {
  const [form, setForm] = useState({
    title: "", description: "", status: "backlog", priority: "medium",
    category: "other", assigned_to: "", due_date: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "backlog",
        priority: task.priority || "medium",
        category: task.category || "other",
        assigned_to: task.assigned_to || "",
        // Xử lý cắt chuỗi ngày tháng để tránh lỗi hiển thị trên thẻ <input type="date">
        due_date: task.due_date ? task.due_date.substring(0, 10) : "",
      });
    } else {
      setForm({ title: "", description: "", status: "backlog", priority: "medium", category: "other", assigned_to: "", due_date: "" });
    }
  }, [task, open]);

  // 2. Chuyển đổi hàm Tạo & Cập nhật sang REST API
  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    
    // Lấy ID linh hoạt (tương thích cả ID cũ và _id của MongoDB)
    const taskId = task?.id || task?._id;

    try {
      if (task) {
        // Gọi API Node.js: PUT /api/tasks/:id
        await apiClient.put(`/tasks/${taskId}`, form);
      } else {
        // Gọi API Node.js: POST /api/tasks
        await apiClient.post("/tasks", form);
      }
      onOpenChange(false);
      onSaved(); // Gọi hàm refresh lại bảng Kanban bên trang chính
    } catch (error) {
      console.error("Error when saving tasks:", error);
    } finally {
      setSaving(false);
    }
  };

  // 3. Chuyển đổi hàm Xóa sang REST API
  const handleDelete = async () => {
    if (!task) return;
    const taskId = task.id || task._id;

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // Gọi API Node.js: DELETE /api/tasks/:id
        await apiClient.delete(`/tasks/${taskId}`);
        onOpenChange(false);
        onSaved(); // Làm mới giao diện Kanban
      } catch (error) {
        console.error("Error deleting tasks:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title..." />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the task..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Assigned To (email)</Label>
            <Input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} placeholder="user@example.com" />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {task && (
            <Button variant="ghost" size="sm" className="text-destructive mr-auto" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving || !form.title.trim()}>
            {saving ? "Saving..." : task ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}