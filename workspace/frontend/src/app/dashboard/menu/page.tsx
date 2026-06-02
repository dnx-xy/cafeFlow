'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/lib/currency';
import {
  Plus, ArrowLeft, UtensilsCrossed, FolderTree, Beef,
  Edit, Trash2, AlertTriangle, MoreHorizontal, EyeOff, PlusCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMenus, Menu, MenuCategory, MenuItem } from '@/hooks/useMenus';

export default function MenuPage() {
  const {
    menus, selectedMenu, loading, error,
    fetchMenus, fetchMenuWithItems,
    createMenu, updateMenu, deleteMenu,
    createCategory, updateCategory, deleteCategory,
    createItem, updateItem, deleteItem,
    setSelectedMenu,
  } = useMenus();

  const { currency } = useCurrency();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);

  const [menuForm, setMenuForm] = useState({ name: '', description: '', isActive: true });
  const [catForm, setCatForm] = useState({ name: '', description: '', sortIndex: 0 });
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: 0, menuCategoryId: '', available: true, hidden: false, categorySortIndex: 0 });

  useEffect(() => { fetchMenus(); }, []);

  const handleCreateMenu = async () => {
    if (!menuForm.name) { toast.error('Menu name is required'); return; }
    try { await createMenu(menuForm); setShowCreateMenu(false); setMenuForm({ name: '', description: '', isActive: true }); toast.success('Menu created'); }
    catch { toast.error('Failed to create menu'); }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu || !menuForm.name) return;
    try { await updateMenu(editingMenu.id, menuForm); setEditingMenu(null); setMenuForm({ name: '', description: '', isActive: true }); toast.success('Menu updated'); }
    catch { toast.error('Failed to update menu'); }
  };

  const handleDeleteMenu = async (id: string) => {
    try { await deleteMenu(id); toast.success('Menu deleted'); } catch { toast.error('Failed to delete menu'); }
  };

  const handleCreateCategory = async () => {
    if (!selectedMenu || !catForm.name) { toast.error('Category name is required'); return; }
    try { await createCategory(selectedMenu.id, catForm); setShowCreateCategory(false); setCatForm({ name: '', description: '', sortIndex: 0 }); toast.success('Category created'); }
    catch { toast.error('Failed to create category'); }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !catForm.name) return;
    try { await updateCategory(editingCategory.id, catForm); setEditingCategory(null); setCatForm({ name: '', description: '', sortIndex: 0 }); toast.success('Category updated'); }
    catch { toast.error('Failed to update category'); }
  };

  const handleCreateItem = async () => {
    if (!selectedMenu || !itemForm.name || !itemForm.price) { toast.error('Name and price required'); return; }
    try { await createItem(selectedMenu.id, itemForm); setShowCreateItem(false); setItemForm({ name: '', description: '', price: 0, menuCategoryId: '', available: true, hidden: false, categorySortIndex: 0 }); toast.success('Item created'); }
    catch { toast.error('Failed to create item'); }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !itemForm.name) return;
    try { await updateItem(editingItem.id, itemForm); setEditingItem(null); setItemForm({ name: '', description: '', price: 0, menuCategoryId: '', available: true, hidden: false, categorySortIndex: 0 }); toast.success('Item updated'); }
    catch { toast.error('Failed to update item'); }
  };

  const openMenu = (menu: Menu) => fetchMenuWithItems(menu.id);
  const openEditMenu = (menu: Menu) => { setEditingMenu(menu); setMenuForm({ name: menu.name, description: menu.description || '', isActive: menu.isActive }); };
  const openEditCategory = (cat: MenuCategory) => { setEditingCategory(cat); setCatForm({ name: cat.name, description: cat.description || '', sortIndex: cat.sortIndex ?? 0 }); };
  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({ name: item.name, description: item.description || '', price: item.price, menuCategoryId: item.menuCategoryId || '', available: item.available, hidden: item.hidden, categorySortIndex: item.categorySortIndex ?? 0 });
  };

  if (!selectedMenu) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage your menus, categories, and items</p>
          </div>
          <Button size="sm" onClick={() => { setShowCreateMenu(true); setEditingMenu(null); setMenuForm({ name: '', description: '', isActive: true }); }}>
            <Plus className="w-4 h-4 mr-1.5" /> Create Menu
          </Button>
        </div>

        {loading && !menus ? (
          <div className="flex justify-center items-center h-48"><div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : error && !menus ? (
          <div className="text-center py-10"><AlertTriangle className="w-10 h-10 mx-auto text-red-500 mb-3" /><p className="text-red-500 text-sm mb-3">{error}</p><Button variant="outline" size="sm" onClick={fetchMenus}>Retry</Button></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(menus ?? []).map(menu => (
              <div key={menu.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{menu.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{menu.description || 'No description'}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7 -mr-1"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => openEditMenu(menu)}><Edit className="mr-2 w-4 h-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMenu(menu.id)}><Trash2 className="mr-2 w-4 h-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={menu.isActive ? 'secondary' : 'destructive'} className="text-[10px]">{menu.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openMenu(menu)}>Manage Items</Button>
                </div>
              </div>
            ))}
            {(menus ?? []).length === 0 && (
              <div className="col-span-full text-center py-12">
                <UtensilsCrossed className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No menus yet</p>
                <Button size="sm" onClick={() => { setShowCreateMenu(true); setMenuForm({ name: '', description: '', isActive: true }); }}><Plus className="w-4 h-4 mr-1.5" />Create First Menu</Button>
              </div>
            )}
          </div>
        )}

        <Dialog open={showCreateMenu || editingMenu !== null} onOpenChange={open => { if (!open) { setShowCreateMenu(false); setEditingMenu(null); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{editingMenu ? 'Edit Menu' : 'Create Menu'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name *</label><Input value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="Main Menu" className="h-9 text-sm" /></div>
              <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Description</label><Textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Describe your menu" className="text-sm" /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={menuForm.isActive} onChange={e => setMenuForm({ ...menuForm, isActive: e.target.checked })} className="rounded" />Active</label>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => { setShowCreateMenu(false); setEditingMenu(null); }}>Cancel</Button>
                <Button size="sm" onClick={editingMenu ? handleUpdateMenu : handleCreateMenu}>{editingMenu ? 'Update' : 'Create'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  const categories = selectedMenu.categories ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setSelectedMenu(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedMenu.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMenu.description || 'No description'}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => openEditMenu(selectedMenu)}>
          <Edit className="w-4 h-4 mr-1.5" /> Edit Menu
        </Button>
      </div>

      {categories.map(cat => (
        <div key={cat.id} className="bg-white dark:bg-[#16181f] rounded-xl border border-gray-100 dark:border-gray-800/50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.name}</span>
              {cat.description && <span className="text-xs text-gray-400 hidden sm:inline">{cat.description}</span>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEditCategory(cat)}><Edit className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500" onClick={async () => { try { await deleteCategory(cat.id); toast.success('Category deleted'); } catch { toast.error('Failed to delete'); } }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="p-5">
            {(!cat.menuItems || cat.menuItems.length === 0) && (
              <p className="text-sm text-gray-400 text-center py-4">No items in this category</p>
            )}
            <div className="space-y-2">
              {(cat.menuItems ?? []).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Beef className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        {item.hidden && <EyeOff className="w-3 h-3 text-gray-400 shrink-0" />}
                        {!item.available && <Badge variant="destructive" className="text-[10px] px-1 py-0">Unavailable</Badge>}
                      </div>
                      {item.description && <p className="text-xs text-gray-400 truncate">{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(item.price, currency)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-7 h-7"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => openEditItem(item)}><Edit className="mr-2 w-4 h-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={async () => { try { await deleteItem(item.id); toast.success('Item deleted'); } catch { toast.error('Failed to delete'); } }}><Trash2 className="mr-2 w-4 h-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-1 text-xs text-gray-400 h-8" onClick={() => {
                setShowCreateItem(true);
                setItemForm({ name: '', description: '', price: 0, menuCategoryId: cat.id, available: true, hidden: false, categorySortIndex: (cat.menuItems?.length ?? 0) + 1 });
              }}>
                <PlusCircle className="w-4 h-4 mr-1.5" />Add Item to {cat.name}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => { setShowCreateCategory(true); setCatForm({ name: '', description: '', sortIndex: 0 }); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
        <Button variant="outline" size="sm" className="h-9 text-xs" onClick={() => {
          setShowCreateItem(true);
          setItemForm({ name: '', description: '', price: 0, menuCategoryId: categories[0]?.id || '', available: true, hidden: false, categorySortIndex: 0 });
        }}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Item
        </Button>
      </div>

      <Dialog open={showCreateCategory || editingCategory !== null} onOpenChange={open => { if (!open) { setShowCreateCategory(false); setEditingCategory(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name *</label><Input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Coffee" className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Description</label><Textarea value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} placeholder="Category description" className="text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Sort Order</label><Input type="number" min="0" value={catForm.sortIndex} onChange={e => setCatForm({ ...catForm, sortIndex: parseInt(e.target.value) || 0 })} className="h-9 text-sm" /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setShowCreateCategory(false); setEditingCategory(null); }}>Cancel</Button>
              <Button size="sm" onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>{editingCategory ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateItem || editingItem !== null} onOpenChange={open => { if (!open) { setShowCreateItem(false); setEditingItem(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name *</label><Input value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} placeholder="e.g. Signature Latte" className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Description</label><Textarea value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Item description" className="text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Price *</label><Input type="number" min="0" step="0.01" value={itemForm.price || ''} onChange={e => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })} placeholder="9.99" className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Sort Order</label><Input type="number" min="0" value={itemForm.categorySortIndex} onChange={e => setItemForm({ ...itemForm, categorySortIndex: parseInt(e.target.value) || 0 })} className="h-9 text-sm" /></div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
              <select className="flex h-9 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16181f] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                value={itemForm.menuCategoryId} onChange={e => setItemForm({ ...itemForm, menuCategoryId: e.target.value })}>
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={itemForm.available} onChange={e => setItemForm({ ...itemForm, available: e.target.checked })} className="rounded" />Available</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={itemForm.hidden} onChange={e => setItemForm({ ...itemForm, hidden: e.target.checked })} className="rounded" />Hidden</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setShowCreateItem(false); setEditingItem(null); }}>Cancel</Button>
              <Button size="sm" onClick={editingItem ? handleUpdateItem : handleCreateItem}>{editingItem ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editingMenu !== null && selectedMenu !== null} onOpenChange={open => { if (!open) setEditingMenu(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Menu</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name *</label><Input value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} className="h-9 text-sm" /></div>
            <div><label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Description</label><Textarea value={menuForm.description} onChange={e => setMenuForm({ ...menuForm, description: e.target.value })} className="text-sm" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={menuForm.isActive} onChange={e => setMenuForm({ ...menuForm, isActive: e.target.checked })} className="rounded" />Active</label>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditingMenu(null)}>Cancel</Button>
              <Button size="sm" onClick={handleUpdateMenu}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
