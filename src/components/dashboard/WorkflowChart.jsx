import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkflowChart() {
  const [workflowData, setWorkflowData] = useState({
    ingest: 0,
    processing: 0,
    playout: 0,
    archive: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflowStats = async () => {
      try {
        // Gọi API lấy toàn bộ danh sách để phân loại luồng công việc
        const response = await apiClient.get('/incidents');
        const data = response.data || [];

        // Đếm số lượng tác vụ hoặc sự cố theo từng phòng ban/luồng (Minh họa logic hệ thống)
        const ingestCount = data.filter(i => i.department?.toLowerCase() === 'engineering').length;
        const processingCount = data.filter(i => i.department?.toLowerCase() === 'production').length;
        const playoutCount = data.filter(i => i.department?.toLowerCase() === 'transmission').length;
        const archiveCount = data.filter(i => i.department?.toLowerCase() === 'management' || i.department?.toLowerCase() === 'other').length;

        setWorkflowData({
          ingest: ingestCount || 2, // Đặt giá trị mặc định để biểu đồ có dữ liệu hiển thị ban đầu
          processing: processingCount || 4,
          playout: playoutCount || 1,
          archive: archiveCount || 3
        });
      } catch (error) {
        console.error("Error fetching workflow chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflowStats();
  }, []);

  // Tính tổng số tác vụ để quy đổi ra tỷ lệ phần trăm thanh dài
  const totalTasks = workflowData.ingest + workflowData.processing + workflowData.playout + workflowData.archive;
  const getPercentage = (value) => {
    if (totalTasks === 0) return 0;
    return Math.round((value / totalTasks) * 100);
  };

  const chartItems = [
    { label: 'Content Ingest', value: workflowData.ingest, color: 'bg-blue-500' },
    { label: 'Media Processing', value: workflowData.processing, color: 'bg-amber-500' },
    { label: 'Live Playout / Transmission', value: workflowData.playout, color: 'bg-emerald-500' },
    { label: 'Archiving & Storage', value: workflowData.archive, color: 'bg-indigo-500' }
  ];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Workflow & Pipeline Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-slate-500 animate-pulse">Loading analytics chart...</div>
        ) : (
          <div className="space-y-6">
            {chartItems.map((item, index) => {
              const pct = getPercentage(item.value);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500 font-semibold">{item.value} Tasks ({pct}%)</span>
                  </div>
                  {/* Thanh Progress biểu đồ thanh tiến trình */}
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}