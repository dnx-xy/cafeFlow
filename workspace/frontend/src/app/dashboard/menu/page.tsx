'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  ArrowLeft,
  UtensilsCrossed,
  FolderTree,
  Beef,
  Edit,
  Trash2,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  EyeOff,
  PlusCircle,
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

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);

  const [menuForm, setMenuForm] = useState({ name: '', description: '', isActive: true });
  const [catForm, setCatForm] = useState({ name: '', description: '', sortIndex: 0 });
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: 0, menuCategoryId: '', available: true, hidden: false, categorySortIndex: 0 });

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleCreateMenu = async () => {
    if (!menuForm.name) { toast.error('Menu name is required'); return; }
    try {
      await createMenu(menuForm);
      setShowCreateMenu(false);
      setMenuForm({ name: '', description: '', isActive: true });
      toast.success('Menu created');
    } catch { toast.error('Failed to create menu'); }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu || !menuForm.name) return;
    try {
      await updateMenu(editingMenu.id, menuForm);
      setEditingMenu(null);
      setMenuForm({ name: '', description: '', isActive: true });
      toast.success('Menu updated');
    } catch { toast.error('Failed to update menu'); }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      await deleteMenu(id);
      toast.success('Menu deleted');
    } catch { toast.error('Failed to delete menu'); }
  };

  const handleCreateCategory = async () => {
    if (!selectedMenu || !catForm.name) { toast.error('Category name is required'); return; }
    try {
      await createCategory(selectedMenu.id, catForm);
      setShowCreateCategory(false);
      setCatForm({ name: '', description: '', sortIndex: 0 });
      toast.success('Category created');
    } catch { toast.error('Failed to create category'); }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !catForm.name) return;
    try {
      await updateCategory(editingCategory.id, catForm);
      setEditingCategory(null);
      setCatForm({ name: '', description: '', sortIndex: 0 });
      toast.success('Category updated');
    } catch { toast.error('Failed to update category'); }
  };

  const handleCreateItem = async () => {
    if (!selectedMenu || !itemForm.name || !itemForm.price) { toast.error('Name and price required'); return; }
    try {
      await createItem(selectedMenu.id, itemForm);
      setShowCreateItem(false);
      setItemForm({ name: '', description: '', price: 0, menuCategoryId: '', available: true, hidden: false, categorySortIndex: 0 });
      toast.success('Item created');
    } catch { toast.error('Failed to create item'); }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !itemForm.name) return;
    try {
      await updateItem(editingItem.id, itemForm);
      setEditingItem(null);
      setItemForm({ name: '', description: '', price: 0, menuCategoryId: '', available: true, hidden: false, categorySortIndex: 0 });
      toast.success('Item updated');
    } catch { toast.error('Failed to update item'); }
  };

  const openMenu = (menu: Menu) => {
    fetchMenuWithItems(menu.id);
  };

  const openEditMenu = (menu: Menu) => {
    setEditingMenu(menu);
    setMenuForm({ name: menu.name, description: menu.description || '', isActive: menu.isActive });
  };

  const openEditCategory = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setCatForm({ name: cat.name, description: cat.description || '', sortIndex: cat.sortIndex ?? 0 });
  };

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      menuCategoryId: item.menuCategoryId || '',
      available: item.available,
      hidden: item.hidden,
      categorySortIndex: item.categorySortIndex ?? 0,
    });
  };

  // --- Menu List View ---
  if (!selectedMenu) {
    return (
      <div className="space-y-6" suppressHydrationWarning>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
            <p className="text-muted-foreground">Create and manage your menus, categories, and items</p>
          </div>
          <Button onClick={() => { setShowCreateMenu(true); setEditingMenu(null); setMenuForm({ name: '', description: '', isActive: true }); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Menu
          </Button>
        </div>

        {loading && menus === null ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
          </div>
        ) : error && menus === null ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchMenus}>Retry</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(menus ?? []).map((menu) => (
              <Card key={menu.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{menu.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{menu.description || 'No description'}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted focus:outline-none">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditMenu(menu)}>
                          <Edit className="mr-2 w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMenu(menu.id)}>
                          <Trash2 className="mr-2 w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={menu.isActive ? 'secondary' : 'destructive'} className="text-xs">
                      {menu.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => openMenu(menu)}>
                      Manage Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(menus ?? []).length === 0 && (
              <div className="col-span-full text-center py-12">
                <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No menus yet</p>
                <Button onClick={() => { setShowCreateMenu(true); setMenuForm({ name: '', description: '', isActive: true }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Menu
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Menu Dialog */}
        <Dialog open={showCreateMenu || editingMenu !== null} onOpenChange={(open) => { if (!open) { setShowCreateMenu(false); setEditingMenu(null); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingMenu ? 'Edit Menu' : 'Create Menu'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Name *</label>
                <Input value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="Main Menu" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Description</label>
                <Textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Describe your menu" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="menu-active" checked={menuForm.isActive} onChange={(e) => setMenuForm({ ...menuForm, isActive: e.target.checked })} className="rounded" />
                <label htmlFor="menu-active" className="text-sm">Active</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setShowCreateMenu(false); setEditingMenu(null); }}>Cancel</Button>
                <Button onClick={editingMenu ? handleUpdateMenu : handleCreateMenu}>
                  {editingMenu ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // --- Menu Detail View ---
  const categories = selectedMenu.categories ?? [];

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedMenu(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedMenu.name}</h1>
            <p className="text-sm text-muted-foreground">{selectedMenu.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditMenu(selectedMenu)}>
            <Edit className="w-4 h-4 mr-2" /> Edit Menu
          </Button>
        </div>
      </div>

      {/* Categories */}
      {categories.map((cat) => (
        <Card key={cat.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-lg">{cat.name}</CardTitle>
                {cat.description && (
                  <p className="text-sm text-muted-foreground hidden sm:block">{cat.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditCategory(cat)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={async () => {
                  try { await deleteCategory(cat.id); toast.success('Category deleted'); } catch { toast.error('Failed to delete'); }
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {(!cat.menuItems || cat.menuItems.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No items in this category</p>
            )}
            <div className="space-y-2">
              {(cat.menuItems ?? []).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                      <Beef className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.hidden && <EyeOff className="w-3 h-3 text-muted-foreground" />}
                        {!item.available && <Badge variant="destructive" className="text-[10px] px-1 py-0">Unavailable</Badge>}
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-semibold text-amber-600">${item.price.toFixed(2)}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted focus:outline-none">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditItem(item)}>
                          <Edit className="mr-2 w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={async () => {
                          try { await deleteItem(item.id); toast.success('Item deleted'); } catch { toast.error('Failed to delete'); }
                        }}>
                          <Trash2 className="mr-2 w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground" onClick={() => {
                setShowCreateItem(true);
                setItemForm({ name: '', description: '', price: 0, menuCategoryId: cat.id, available: true, hidden: false, categorySortIndex: (cat.menuItems?.length ?? 0) + 1 });
              }}>
                <PlusCircle className="w-4 h-4 mr-2" /> Add Item to {cat.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Category / Add Item */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => { setShowCreateCategory(true); setCatForm({ name: '', description: '', sortIndex: 0 }); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
        <Button variant="outline" onClick={() => {
          setShowCreateItem(true);
          setItemForm({ name: '', description: '', price: 0, menuCategoryId: categories[0]?.id || '', available: true, hidden: false, categorySortIndex: 0 });
        }}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Create/Edit Category Dialog */}
      <Dialog open={showCreateCategory || editingCategory !== null} onOpenChange={(open) => { if (!open) { setShowCreateCategory(false); setEditingCategory(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Name *</label>
              <Input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Coffee, Pastries" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Category description" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Sort Order</label>
              <Input type="number" min="0" value={catForm.sortIndex} onChange={(e) => setCatForm({ ...catForm, sortIndex: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowCreateCategory(false); setEditingCategory(null); }}>Cancel</Button>
              <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Item Dialog */}
      <Dialog open={showCreateItem || editingItem !== null} onOpenChange={(open) => { if (!open) { setShowCreateItem(false); setEditingItem(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Name *</label>
              <Input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} placeholder="e.g. Signature Latte" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Item description" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Price *</label>
              <Input type="number" min="0" step="0.01" value={itemForm.price || ''} onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) || 0 })} placeholder="9.99" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Sort Order (within category)</label>
              <Input type="number" min="0" value={itemForm.categorySortIndex} onChange={(e) => setItemForm({ ...itemForm, categorySortIndex: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Category</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={itemForm.menuCategoryId}
                onChange={(e) => setItemForm({ ...itemForm, menuCategoryId: e.target.value })}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} className="rounded" />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={itemForm.hidden} onChange={(e) => setItemForm({ ...itemForm, hidden: e.target.checked })} className="rounded" />
                Hidden
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowCreateItem(false); setEditingItem(null); }}>Cancel</Button>
              <Button onClick={editingItem ? handleUpdateItem : handleCreateItem}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog (reused) */}
      <Dialog open={editingMenu !== null && selectedMenu !== null} onOpenChange={(open) => { if (!open) setEditingMenu(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Name *</label>
              <Input value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="menu-active-detail" checked={menuForm.isActive} onChange={(e) => setMenuForm({ ...menuForm, isActive: e.target.checked })} className="rounded" />
              <label htmlFor="menu-active-detail" className="text-sm">Active</label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingMenu(null)}>Cancel</Button>
              <Button onClick={handleUpdateMenu}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
