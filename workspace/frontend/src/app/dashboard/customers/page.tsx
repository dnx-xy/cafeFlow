'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  DollarSign,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { useCustomers } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function CustomersPage() {
  const { customers, loading, error, pagination, fetchCustomers } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber?.includes(searchQuery);
    
    return matchesSearch;
  });

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: '1,247', icon: Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'New This Week', value: '42', icon: Calendar, color: 'bg-green-100 text-green-600' },
          { label: 'Total Spent', value: '$24,580', icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
          { label: 'Avg. Visit', value: '3.2', icon: Users, color: 'bg-orange-100 text-orange-600' },
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Customers</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchCustomers()}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Contact</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Visits</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Spent</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Loyalty</th>
                      <th className="text-center text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Status</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-medium mr-3">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">{customer.joinDate}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                              <span>{customer.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                              <span>{customer.phoneNumber || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{customer.visitCount}</td>
                        <td className="py-4 text-sm">${customer.totalSpent.toFixed(2)}</td>
                        <td className="py-4 text-center">
                          <Badge variant="outline" className="text-xs">
                            {customer.loyaltyPoints} pts
                          </Badge>
                        </td>
                        <td className="py-4 text-center">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${statusColors.ACTIVE || ''}`}
                          >
                            Active
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 w-4 h-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 w-4 h-4" />
                                Edit Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 w-4 h-4" />
                                Delete Customer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredCustomers.length}</span> of <span className="font-medium">{filteredCustomers.length}</span> customers
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}