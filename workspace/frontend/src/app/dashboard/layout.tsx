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
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LanguageSwitcherCompact } from '@/components/marketing/LanguageSwitcherCompact';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useI18n } from '@/i18n/context';
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
  MessageSquare,
  RefreshCw,
} from 'lucide-react';

const sidebarItems = [
  { href: '/dashboard', labelKey: 'dashboard' as const, icon: LayoutDashboard },
  { href: '/dashboard/kiosk', labelKey: 'kiosk' as const, icon: Grid },
  { href: '/dashboard/orders', labelKey: 'orders' as const, icon: ShoppingCart },
  { href: '/dashboard/menu', labelKey: 'menu' as const, icon: UtensilsCrossed },
  { href: '/dashboard/customers', labelKey: 'customers' as const, icon: Users },
  { href: '/dashboard/loyalty', labelKey: 'loyalty' as const, icon: Award },
  { href: '/dashboard/reviews', labelKey: 'reviews' as const, icon: Star },
  { href: '/dashboard/tables', labelKey: 'tables' as const, icon: QrCode },
  { href: '/dashboard/analytics', labelKey: 'analytics' as const, icon: BarChart3 },
  { href: '/dashboard/marketing', labelKey: 'marketing' as const, icon: Megaphone },
  { href: '/dashboard/messages', labelKey: 'messages' as const, icon: MessageSquare },
  { href: '/dashboard/settings', labelKey: 'settings' as const, icon: Settings },
];

const bottomItems = [
  { href: '/dashboard/billing', labelKey: 'billing' as const, icon: CreditCard },
  { href: '/dashboard/team', labelKey: 'team' as const, icon: UserCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useI18n();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenantsLoading, setTenantsLoading] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const getPageTitle = () => {
    const path = pathname.split('/').pop() || 'dashboard';
    const key = path.replace(/-/g, '') as keyof typeof t.dashboard.nav;
    return t.dashboard.nav[key] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications(user?.businessId);

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
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">CafeFlow</span>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Workspace</p>
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
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      active
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    <item.icon className={cn('w-4.5 h-4.5 shrink-0', active && 'text-amber-600 dark:text-amber-400')} />
                    <span>{t.dashboard.nav[item.labelKey]}</span>
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
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      isActive('/dashboard/tenants')
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    <Database className="w-4.5 h-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{t.dashboard.nav.tenants}</span>
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
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                      active
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                    )}
                  >
                    <item.icon className={cn('w-4.5 h-4.5 shrink-0', active && 'text-amber-600 dark:text-amber-400')} />
                    <span>{t.dashboard.nav[item.labelKey]}</span>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-border/50 bg-muted/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-muted/50 transition-colors text-left group border border-transparent hover:border-border/50">
                  <Avatar className="w-10 h-10 shadow-sm border border-border/50 group-hover:scale-105 transition-transform">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-extrabold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate group-hover:text-amber-600 transition-colors">{user?.name || 'User'}</p>
                    <p className="text-xs font-medium text-muted-foreground truncate mt-0.5">
                      {isSuperAdmin ? getCurrentTenantDisplayName() : (currentTenant?.name || user?.businessId || 'Unknown')}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-amber-600 transition-colors shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/50 shadow-xl p-2">
                <DropdownMenuItem className="p-3 rounded-xl font-medium cursor-pointer hover:bg-muted/50">
                  <UserCircle className="mr-3 w-4 h-4 text-muted-foreground" /> {t.dashboard.header.profile}
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 rounded-xl font-medium cursor-pointer hover:bg-muted/50">
                  <Settings className="mr-3 w-4 h-4 text-muted-foreground" /> {t.dashboard.header.settings}
                </DropdownMenuItem>
                {isSuperAdmin && (
                  <DropdownMenuItem className="p-3 rounded-xl font-medium cursor-pointer hover:bg-muted/50">
                    <Globe className="mr-3 w-4 h-4 text-muted-foreground" /> {t.dashboard.header.manageTenants}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-2 bg-border/50" />
                <DropdownMenuItem className="p-3 rounded-xl font-bold cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-500/10" onClick={logout}>
                  <LogOut className="mr-3 w-4 h-4" /> {t.dashboard.header.logOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        <div className="lg:ml-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden w-10 h-10 -ml-2" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
                </Button>
                <h1 className="text-2xl font-extrabold text-foreground capitalize tracking-tight">{getPageTitle()}</h1>
              </div>
              <div className="flex items-center gap-3">
                {isSuperAdmin && (
                  <div className="flex items-center gap-3 hidden sm:flex">
                    <Select 
                      value={user?.tenantId} 
                      onValueChange={handleSwitchTenant}
                      disabled={tenantsLoading}
                    >
                      <SelectTrigger className="h-10 w-48 text-sm font-medium bg-muted/50 border-0 focus:ring-amber-500 rounded-xl">
                        <SelectValue placeholder={tenantsLoading ? t.dashboard.header.loadingTenants : t.dashboard.header.selectTenant}>
                          {currentTenant?.name || tenants.find(t => t.id === user?.tenantId)?.name || t.dashboard.header.selectTenant}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/50 shadow-xl">
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id} className="font-medium rounded-lg">
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      className="h-10 px-4 rounded-xl font-semibold border-border/50 shadow-sm hover:bg-muted"
                      onClick={() => {
                        fetchTenants();
                        toast.info('Refreshing tenant data...');
                      }}
                      disabled={tenantsLoading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${tenantsLoading ? 'animate-spin' : ''}`} />
                      {t.dashboard.header.refreshData}
                    </Button>
                  </div>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-amber-500/10 hover:text-amber-600 transition-colors border border-transparent hover:border-amber-500/30 group">
                      <Bell className="w-5 h-5 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-extrabold rounded-full ring-4 ring-background px-1.5 shadow-sm">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 sm:w-96 p-0 rounded-3xl border border-border/50 shadow-2xl overflow-hidden" sideOffset={12}>
                    <div className="p-4 sm:p-5 border-b border-border/50 flex items-center justify-between bg-muted/30">
                      <p className="text-base font-bold text-foreground">Notifications</p>
                      <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold transition-colors">
                            Mark all read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors">
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center flex flex-col items-center">
                           <Bell className="w-10 h-10 text-muted-foreground opacity-20 mb-3" />
                           <p className="text-sm font-medium text-muted-foreground">You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <Link
                            key={n.id}
                            href={n.link || '#'}
                            className={`flex items-start gap-4 p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors group ${n.read ? '' : 'bg-amber-500/5'}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-border/50 group-hover:scale-105 transition-transform ${n.type === 'order' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : n.type === 'payment' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {n.type === 'order' ? <ShoppingCart className="w-5 h-5" /> : n.type === 'payment' ? <CreditCard className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                              <p className={`text-sm font-bold truncate ${n.read ? 'text-foreground' : 'text-amber-700 dark:text-amber-400'}`}>{n.title}</p>
                              <p className="text-xs font-medium text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2 opacity-70">
                                {new Date(n.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <Badge className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 shadow-sm hidden sm:inline-flex rounded-lg">
                  {isSuperAdmin ? 'Super Admin' : 'Pro Plan'}
                </Badge>
                <div className="hidden sm:block pl-2 border-l border-border/50 ml-1">
                   <LanguageSwitcherCompact />
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            <CurrencyProvider businessId={user?.businessId}>
              {children}
            </CurrencyProvider>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
