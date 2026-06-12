import React, { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RecentIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Gọi API lấy danh sách sự cố từ Backend 5001 của bạn
        const response = await apiClient.get('/incidents');
        // Lấy 5 sự cố mới nhất để hiển thị ở trang chủ Dashboard
        setIncidents(response.data.slice(0, 5) || []);
      } catch (error) {
        console.error("Error fetching recent incidents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  // Hàm helper để hiển thị màu sắc Badge tùy theo mức độ nghiêm trọng (Severity)
  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <Badge className="bg-red-500 hover:bg-red-600 text-white">Critical</Badge>;
      case 'error': return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Error</Badge>;
      case 'warning': return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black">Warning</Badge>;
      default: return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Info</Badge>;
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-slate-500 animate-pulse">Loading incident data...</div>
        ) : incidents.length === 0 ? (
          <div className="text-sm text-slate-500">No recent incidents recorded.</div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident._id || incident.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">{incident.title}</p>
                  <p className="text-xs text-slate-500">{incident.description || 'No description available'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getSeverityBadge(incident.severity)}
                  <span className="text-xs text-slate-400">
                    {incident.status || 'Open'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}