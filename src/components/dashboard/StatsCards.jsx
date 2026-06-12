import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatsCards() {
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    uptime: '100%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gọi API lấy dữ liệu thống kê từ Backend
        const response = await apiClient.get('/incidents');
        const data = response.data || [];
        
        // Tính toán nhanh số lượng dựa trên mảng trả về
        const total = data.length;
        const active = data.filter(i => i.status?.toLowerCase() !== 'closed' && i.status?.toLowerCase() !== 'resolved').length;
        const resolved = total - active;

        setStats({
          totalIncidents: total,
          activeIncidents: active,
          resolvedIncidents: resolved,
          uptime: '99.98%' // Giá trị tĩnh minh họa cho hệ thống phát sóng
        });
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Mảng chứa cấu hình hiển thị cho 4 thẻ thống kê
  const cardItems = [
    { title: 'Total Incidents', value: stats.totalIncidents, desc: 'All recorded system issues' },
    { title: 'Active Cases', value: stats.activeIncidents, desc: 'Currently being investigated' },
    { title: 'Resolved Cases', value: stats.resolvedIncidents, desc: 'Fixed and closed issues' },
    { title: 'System Uptime', value: stats.uptime, desc: 'Broadcasting availability rate' }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-7 w-16 bg-slate-200 animate-pulse rounded"></div>
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}