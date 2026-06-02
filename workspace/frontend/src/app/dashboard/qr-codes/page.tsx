'use client';

import { useState, useEffect } from 'react';
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
  Plus,
  Edit,
  Trash2,
  Eye,
  QrCode,
  Wifi,
  AlertTriangle,
  Table
} from 'lucide-react';
import { toast } from 'sonner';
import { useTables } from '@/hooks/useTables';

export default function QrCodesPage() {
  const { tables, loading, error, fetchTables, createTable, updateTable, deleteTable, generateQrCode } = useTables();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    name: '',
    capacity: 1,
    isActive: true
  });

  // Load tables on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  const filteredTables = tables.filter(table => 
    table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    table.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTable = async () => {
    try {
      await createTable(newTable);
      setIsCreating(false);
      setNewTable({ tableNumber: '', name: '', capacity: 1, isActive: true });
      toast.success('Table created successfully');
    } catch (err) {
      toast.error('Failed to create table');
    }
  };

  const handleGenerateQrCode = async (tableId: string) => {
    try {
      await generateQrCode(tableId);
      toast.success('QR code generated successfully');
    } catch (err) {
      toast.error('Failed to generate QR code');
    }
  };

  const statusColors: Record<string, string> = {
    true: 'bg-green-100 text-green-800 border-green-200',
    false: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Codes</h1>
          <p className="text-muted-foreground">Manage tables and generate QR codes</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {/* Create Table Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Table</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Table Number *</label>
                <Input
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                  placeholder="e.g. A01, B05"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Table Name</label>
                <Input
                  value={newTable.name}
                  onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                  placeholder="e.g. Window Table 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Capacity</label>
                <Input
                  type="number"
                  min="1"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value) || 1})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Status</label>
                <Select 
                  value={newTable.isActive ? 'true' : 'false'} 
                  onValueChange={(value) => setNewTable({...newTable, isActive: value === 'true'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleCreateTable}>Create Table</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Codes Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Tables & QR Codes</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchTables()}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Table</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Capacity</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">QR Code</th>
                      <th className="text-right text-xs font-medium text-muted-foreground pb-3 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((table) => (
                      <tr key={table.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold mr-3">
                              <Table className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">#{table.tableNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">{table.name || '-'}</p>
                        </td>
                        <td className="py-4">
                          <Badge variant="outline" className="text-xs">
                            {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${statusColors[table.isActive ? 'true' : 'false']}`}
                          >
                            {table.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-4">
                          {table.qrCodes && table.qrCodes.length > 0 ? (
                            <div className="flex items-center">
                              <Badge variant="secondary" className="text-xs flex items-center">
                                <QrCode className="w-3 h-3 mr-1" />
                                Generated
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              No QR
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <div className="w-4 h-4">⋯</div>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Eye className="mr-2 w-4 h-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 w-4 h-4" />
                                Edit Table
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => handleGenerateQrCode(table.id)}
                              >
                                <QrCode className="mr-2 w-4 h-4" />
                                Generate QR Code
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => deleteTable(table.id)}
                              >
                                <Trash2 className="mr-2 w-4 h-4" />
                                Delete Table
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTables.length === 0 && (
                <div className="text-center py-12">
                  <Table className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No tables found</p>
                  {!isCreating && (
                    <Button onClick={() => setIsCreating(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Table
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}