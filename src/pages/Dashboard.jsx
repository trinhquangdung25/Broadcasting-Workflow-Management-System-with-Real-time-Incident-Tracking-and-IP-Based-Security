import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
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

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Task.list("-created_date", 100),
      base44.entities.Incident.list("-created_date", 50),
    ]).then(([t, i]) => {
      setTasks(t);
      setIncidents(i);
      setLoading(false);
    });
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