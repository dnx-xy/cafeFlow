'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { tenantsService, Tenant } from '@/services/tenantsService';
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  Award,
  Star,
  BarChart3,
  Megaphone,
  QrCode,
  Settings,
  CreditCard,
  UserCircle,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
  Globe,
  Database,
  Grid,
} from 'lucide-react';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/loyalty', label: 'Loyalty', icon: Award },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/tables', label: 'Tables', icon: QrCode },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const bottomItems = [
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/team', label: 'Team', icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantsLoading, setTenantsLoading] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  // Determine if user is Super Admin
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Fetch tenants for Super Admin
  useEffect(() => {
    if (isSuperAdmin) {
      fetchTenants();
    }
  }, [isSuperAdmin]);

  // Fetch current tenant info when user changes
  useEffect(() => {
    if (user?.tenantId) {
      fetchCurrentTenant();
    }
  }, [user?.tenantId]);

  const fetchTenants = async () => {
    try {
      setTenantsLoading(true);
      console.log('[FE] Fetching tenants...');
      const tenantsData = await tenantsService.getTenants();
      console.log('[FE] Tenants fetched:', tenantsData);
      setTenants(tenantsData);
    } catch (error) {
      console.error('[FE] Failed to fetch tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setTenantsLoading(false);
    }
  };

  const fetchCurrentTenant = async () => {
    try {
      console.log('[FE] Fetching current tenant for user:', user?.tenantId);
      const tenantData = await tenantsService.getCurrentTenant();
      console.log('[FE] Current tenant fetched:', tenantData);
      setCurrentTenant(tenantData);
    } catch (error) {
      console.error('[FE] Failed to fetch current tenant:', error);
      // Don't show error toast for this - it's not critical
    }
  };

  const handleSwitchTenant = async (tenantId: string) => {
    try {
      // Call the backend API to switch tenant
      const response = await authService.switchTenant(tenantId);
      
      // Store new tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Find tenant name for the toast
      const tenantName = tenants.find(t => t.id === tenantId)?.name || tenantId;
      
      // Show success toast
      toast.success(`Successfully switched to: ${tenantName}`);
      
      // Navigate to dashboard to ensure proper auth context
      // This will trigger the auth hook to re-initialize properly
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Tenant switch error:', error);
      toast.error('Failed to switch tenant');
    }
  };

  // Get the display name for the current tenant
  const getCurrentTenantDisplayName = () => {
    if (currentTenant) {
      return currentTenant.name;
    }
    // Fallback to tenant ID or business ID
    return user?.businessId || 'Unknown Tenant';
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0f1117]">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={cn(
            'fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#16181f] border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="p-5 border-b border-gray-100 dark:border-gray-800/50">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                <Coffee className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">CafeFlow</span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5">Dashboard</p>
              </div>
            </Link>
          </div>

          <ScrollArea className="flex-1 py-3 px-2.5">
            <nav className="space-y-0.5">
              {sidebarItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    <item.icon className={cn('w-4.5 h-4.5 shrink-0', active && 'text-amber-600 dark:text-amber-400')} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {isSuperAdmin && (
              <>
                <div className="my-3 mx-3 h-px bg-gray-100 dark:bg-gray-800/50" />
                <nav className="space-y-0.5">
                  <Link
                    href="/dashboard/tenants"
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive('/dashboard/tenants')
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    <Database className="w-4.5 h-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Tenants</span>
                  </Link>
                </nav>
              </>
            )}

            <div className="my-3 mx-3 h-px bg-gray-100 dark:bg-gray-800/50" />

            <nav className="space-y-0.5">
              {bottomItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      active
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    <item.icon className={cn('w-4.5 h-4.5 shrink-0', active && 'text-amber-600 dark:text-amber-400')} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-3 border-t border-gray-100 dark:border-gray-800/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors text-left group">
                  <Avatar className="w-8 h-8 ring-2 ring-gray-100 dark:ring-gray-800">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {isSuperAdmin ? getCurrentTenantDisplayName() : (currentTenant?.name || user?.businessId || 'Unknown')}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <UserCircle className="mr-2 w-4 h-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 w-4 h-4" /> Settings
                </DropdownMenuItem>
                {isSuperAdmin && (
                  <DropdownMenuItem>
                    <Globe className="mr-2 w-4 h-4" /> Manage Tenants
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={logout}>
                  <LogOut className="mr-2 w-4 h-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        <div className="lg:ml-64">
          <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <div className="flex items-center gap-2">
                    <Select 
                      value={user?.tenantId} 
                      onValueChange={handleSwitchTenant}
                      disabled={tenantsLoading}
                    >
                      <SelectTrigger className="h-8 w-48 text-xs border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16181f]">
                        <SelectValue placeholder={tenantsLoading ? "Loading tenants..." : "Select Tenant"}>
                          {currentTenant?.name || tenants.find(t => t.id === user?.tenantId)?.name || "Select Tenant"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => {
                        fetchTenants();
                        toast.info('Refreshing tenant data...');
                      }}
                      disabled={tenantsLoading}
                    >
                      Refresh Data
                    </Button>
                  </div>
                )}
                <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors">
                  <Bell className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0f1117]" />
                </button>
                <Badge variant="outline" className="text-[11px] font-medium text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hidden sm:inline-flex">
                  {isSuperAdmin ? 'Super Admin' : 'Pro Plan'}
                </Badge>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
