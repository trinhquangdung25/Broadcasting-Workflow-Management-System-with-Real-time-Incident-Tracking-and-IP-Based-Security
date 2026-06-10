// 1. Không cần useState hay useEffect nữa vì đã có Context
import { useAuth } from "@/lib/AuthContext"; 

import { Shield, Users, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IPWhitelistPanel from "../components/security/IPWhitelistPanel";
import RBACPanel from "../components/security/RBACPanel";

export default function Security() {
  // 2. Lấy thông tin người dùng từ Context (đã được lưu khi đăng nhập)
  const { user } = useAuth();

  // Kiểm tra quyền Admin
  const isAdmin = user?.role === "admin";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Security Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage IP filtering and role-based access control</p>
      </div>

      {/* Hiển thị cảnh báo nếu không phải là Admin */}
      {!isAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm text-amber-600">
          You need admin privileges to manage security settings. Contact your administrator.
        </div>
      )}

      {/* Giao diện Tabs giữ nguyên */}
      <Tabs defaultValue="ip" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ip" className="gap-2">
            <Globe className="h-4 w-4" /> IP Whitelist
          </TabsTrigger>
          <TabsTrigger value="rbac" className="gap-2">
            <Users className="h-4 w-4" /> Access Control
          </TabsTrigger>
        </TabsList>
        
        {/* Truyền biến isAdmin xuống các Component con để chúng tự khóa/mở chức năng */}
        <TabsContent value="ip">
          <IPWhitelistPanel isAdmin={isAdmin} />
        </TabsContent>
        <TabsContent value="rbac">
          <RBACPanel isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  );
}