import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskDialog from "../components/kanban/TaskDialog";

const COLUMNS = [
  { id: "backlog", label: "Backlog", color: "bg-muted-foreground" },
  { id: "pre_production", label: "Pre-Production", color: "bg-purple-500" },
  { id: "in_production", label: "In Production", color: "bg-blue-500" },
  { id: "transmission", label: "Transmission", color: "bg-cyan-500" },
  { id: "post_production", label: "Post-Production", color: "bg-amber-500" },
  { id: "completed", label: "Completed", color: "bg-green-500" },
];

export default function Kanban() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const loadTasks = async () => {
    const data = await base44.entities.Task.list("order", 200);
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
    const unsub = base44.entities.Task.subscribe(() => loadTasks());
    return unsub;
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));
    await base44.entities.Task.update(draggableId, { status: newStatus, order: destination.index });
  };

  const handleCreate = () => {
    setEditTask(null);
    setDialogOpen(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setDialogOpen(true);
  };

  const filtered = tasks.filter(t =>
    !search || t.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag tasks across stages to update progress</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button onClick={handleCreate} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-1.5" /> New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-6 pb-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={filtered.filter(t => t.status === col.id)}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editTask}
        onSaved={loadTasks}
      />
    </div>
  );
}