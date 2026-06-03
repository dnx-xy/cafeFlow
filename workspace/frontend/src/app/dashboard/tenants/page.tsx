'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search, Plus, Users, Building, Globe, Shield, Mail, Clock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { tenantsService, Tenant } from '@/services/tenantsService';
import { authService } from '@/services/authService';

interface TenantWithStats extends Tenant {
  email?: string;
  phone?: string;
  plan?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  users?: number;
  orders?: number;
  revenue?: number;
  businessId?: string;
}

export default function TenantsPage() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<TenantWithStats[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const tenantsData = await tenantsService.getTenants();
      // Map the tenant data with mock stats for now (these would come from a separate API in production)
      const tenantsWithStats: TenantWithStats[] = tenantsData.map((tenant, index) => ({
        ...tenant,
        email: `admin@${tenant.slug}.com`,
        phone: `+1 (555) ${String(100 + index * 111).padStart(3, '0')}-${String(1000 + index * 1111).slice(-4)}`,
        plan: index === 0 ? 'Pro' : index === 1 ? 'Enterprise' : 'Starter',
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        users: 5 + index * 4,
        orders: 890 + index * 780,
        revenue: 17800 + index * 15500,
        businessId: `bg-${100 + index * 111}`
      }));
      setTenants(tenantsWithStats);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(search.toLowerCase()) ||
    (tenant.email?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
    tenant.slug.toLowerCase().includes(search.toLowerCase()) ||
    tenant.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSwitchTenant = async (tenantId: string) => {
    try {
      const response = await authService.switchTenant(tenantId);

      // Store new tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);

      const tenantName = tenants.find(t => t.id === tenantId)?.name || tenantId;
      toast.success(`Switched to: ${tenantName}`);

      // Refresh page to update auth context
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Tenant switch error:', error);
      toast.error('Failed to switch tenant');
    }
  };

  const handleCreateTenant = () => {
    toast.info('Create tenant functionality will be implemented here');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Tenants Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your cafe franchises and businesses</p>
        </div>
        <Button onClick={handleCreateTenant} className="h-9 text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Create Tenant
        </Button>
      </div>

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Active Tenants
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTenants.map(tenant => (
                    <div key={tenant.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800/50 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{tenant.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{tenant.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{tenant.orders?.toLocaleString() || 0} orders</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Revenue: ${tenant.revenue?.toLocaleString() || 0}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleSwitchTenant(tenant.id)}
                        >
                          Switch
                        </Button>
                      </div>
                    </div>
                  ))}

                  {filteredTenants.length === 0 && !loading && (
                    <div className="text-center py-10">
                      <p className="text-gray-500 dark:text-gray-400">No tenants found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Tenant Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Tenants</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{tenants.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 dark:bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Active Businesses</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{tenants.filter(t => t.status === 'ACTIVE').length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-50 dark:bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${tenants.reduce((sum, t) => sum + (t.revenue || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-[#16181f]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start h-9 text-sm">
                  <Shield className="w-4 h-4 mr-2" /> Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 text-sm">
                  <Mail className="w-4 h-4 mr-2" /> Send Notification
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 text-sm">
                  <Clock className="w-4 h-4 mr-2" /> Schedule Maintenance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}