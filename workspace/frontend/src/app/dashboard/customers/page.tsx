'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search, MoreHorizontal, Eye, Edit, Trash2, Plus,
  ChevronLeft, ChevronRight, Users, DollarSign, Calendar, Phone, Mail,
} from 'lucide-react';
import { useCustomers } from '@/hooks/useAuth';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';

export default function CustomersPage() {
  const { currency } = useCurrency();
  const { customers, loading, error, fetchCustomers } = useCustomers();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: '1,247', icon: Users },
          { label: 'New This Week', value: '42', icon: Calendar },
          { label: 'Total Spent', value: '$24,580', icon: DollarSign },
          { label: 'Avg. Visit', value: '3.2', icon: Users },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
              </div>
              <div className="w-9 h-9 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                <s.icon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Button size="sm" className="h-9"><Plus className="w-4 h-4 mr-1.5" /> Add Customer</Button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">Customers</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs"><Plus className="w-3.5 h-3.5 mr-1.5" /> Import</Button>
        </div>
        <div className="p-5 pt-3">
          {loading ? (
            <div className="flex justify-center items-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-10"><p className="text-red-500 text-sm mb-3">{error}</p><Button variant="outline" size="sm" onClick={() => fetchCustomers()}>Retry</Button></div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800/50">
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Customer</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Contact</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Visits</th>
                      <th className="text-left text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Spent</th>
                      <th className="text-center text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Loyalty</th>
                      <th className="text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 pb-3 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/30 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">{c.name.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                              <p className="text-[11px] text-gray-400 dark:text-gray-500">{c.joinDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Mail className="w-3 h-3 mr-1 text-gray-400" />{c.email || 'N/A'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Phone className="w-3 h-3 mr-1 text-gray-400" />{c.phoneNumber || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3.5 text-sm text-gray-700 dark:text-gray-300">{c.visitCount}</td>
                        <td className="py-3.5 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(c.totalSpent, currency)}</td>
                        <td className="py-3.5 text-center">
                          <Badge variant="outline" className="text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
                            {c.loyaltyPoints} pts
                          </Badge>
                        </td>
                        <td className="py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem><Eye className="mr-2 w-4 h-4" />View Profile</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="mr-2 w-4 h-4" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 w-4 h-4" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && !loading && (
                <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No customers found</div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                <p className="text-xs text-gray-400 dark:text-gray-500">Showing 1-{filtered.length} of {filtered.length}</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="w-7 h-7" disabled><ChevronLeft className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="icon" className="w-7 h-7 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400">1</Button>
                  <Button variant="outline" size="icon" className="w-7 h-7" disabled><ChevronRight className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
